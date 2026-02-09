import { ethers } from "ethers";
import artifact from "../abi/CarRental.json";
import { CONTRACT_ADDRESS, SEPOLIA_RPC } from "../abi/contract";

const ABI = artifact.abi;

/* ---------------- CONTRACT INSTANCES ---------------- */

export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

export function getWriteContract(signer) {
  if (!signer) throw new Error("Signer required - Please connect MetaMask");
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

/* ---------------- READ HELPERS ---------------- */

export async function fetchAllCars() {
  const contract = getReadContract();
  try {
    const count = Number(await contract.carCount());
    const cars = [];
    for (let i = 1; i <= count; i++) {
      const car = await contract.cars(i);
      cars.push({
        id: car.id.toString(),
        owner: car.owner,
        model: car.model,
        location: car.pickupLocation,
        pricePerDay: ethers.formatEther(car.pricePerDay),
        status: Number(car.status), 
        earnings: ethers.formatEther(car.earnings)
      });
    }
    return cars;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

export async function getActiveRental(carId) {
  const contract = getReadContract();
  try {
    const rental = await contract.activeRental(carId);
    return {
      carId: rental.carId.toString(),
      renter: rental.renter,
      startDate: Number(rental.startDate),
      endDate: Number(rental.endDate),
      paid: ethers.formatEther(rental.paid),
      active: rental.active
    };
  } catch (error) {
    return null;
  }
}

/* ---------------- OWNER ACTIONS ---------------- */

export async function registerCar(signer, model, location, priceEth) {
  const contract = getWriteContract(signer);
  const tx = await contract.registerCar(
    model,
    location,
    ethers.parseUnits(priceEth.toString(), "ether"),
    { gasLimit: 500000 } 
  );
  return await tx.wait();
}

/* ---------------- RENTER ACTIONS ---------------- */

export async function rentCar(signer, carId, startDate, endDate, totalEth) {
  const contract = getWriteContract(signer);
  const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
  const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

  if (endTimestamp <= startTimestamp) throw new Error("End date must be after start date.");

  const tx = await contract.rentCar(
    carId, 
    startTimestamp, 
    endTimestamp, 
    {
      value: ethers.parseUnits(totalEth.toString(), "ether"),
      gasLimit: 1000000 
    }
  );
  return await tx.wait();
}

/* ---------------- HISTORY FETCHING (NEWLY ADDED) ---------------- */

export async function getOwnerHistory(address) {
  const contract = getReadContract();
  try {
    const history = await contract.getOwnerHistory(address);
    return history.map((rental) => ({
      carId: rental.carId.toString(),
      renter: rental.renter,
      startDate: Number(rental.startDate),
      endDate: Number(rental.endDate),
      paid: ethers.formatEther(rental.paid),
      active: rental.active,
    }));
  } catch (error) {
    console.error("Error fetching owner history:", error);
    return [];
  }
}

export async function getRenterHistory(address) {
  const contract = getReadContract();
  try {
    const history = await contract.getRenterHistory(address);
    return history.map((rental) => ({
      carId: rental.carId.toString(),
      renter: rental.renter,
      startDate: Number(rental.startDate),
      endDate: Number(rental.endDate),
      paid: ethers.formatEther(rental.paid),
      active: rental.active,
    }));
  } catch (error) {
    console.error("Error fetching renter history:", error);
    return [];
  }
}

/* ---------------- NOTIFICATIONS (EVENT LISTENERS) ---------------- */

export function listenToAllEvents(callback) {
  const contract = getReadContract();
  
  contract.on("CarRegistered", (carId, owner, event) => {
    callback({
      type: "REGISTRATION",
      title: "New Car Registered!",
      message: `Car ID #${carId.toString()} has been added to the fleet.`,
      time: new Date().toLocaleTimeString(),
      txHash: event.log.transactionHash
    });
  });

  contract.on("CarRented", (carId, renter, startDate, endDate, paid, event) => {
    callback({
      type: "RENTAL",
      title: "Payment Received!",
      message: `Car #${carId.toString()} was rented by ${renter.substring(0,6)}...`,
      amount: `Earnings: +${ethers.formatEther(paid)} ETH`,
      time: new Date().toLocaleTimeString(),
      txHash: event.log.transactionHash
    });
  });

  return () => {
    contract.removeAllListeners("CarRegistered");
    contract.removeAllListeners("CarRented");
  };
}
import { ethers } from "ethers";
import artifact from "../abi/CarRental.json";
import { CONTRACT_ADDRESS, SEPOLIA_RPC } from "../abi/contract";

// Access the ABI from the Hardhat artifact structure
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
    console.error("Error fetching cars from blockchain:", error);
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

export async function updateCarDetails(signer, carId, location, priceEth) {
  const contract = getWriteContract(signer);
  const tx = await contract.updateCarDetails(
    carId,
    location,
    ethers.parseUnits(priceEth.toString(), "ether"),
    { gasLimit: 500000 }
  );
  return await tx.wait();
}

export async function setCarUnavailable(signer, carId) {
  const contract = getWriteContract(signer);
  const tx = await contract.setCarUnavailable(carId, { gasLimit: 300000 });
  return await tx.wait();
}

export async function endRental(signer, carId) {
  const contract = getWriteContract(signer);
  const tx = await contract.endRental(carId, { gasLimit: 500000 });
  return await tx.wait();
}

/* ---------------- RENTER ACTIONS ---------------- */

export async function rentCar(signer, carId, startDate, endDate, totalEth) {
  const contract = getWriteContract(signer);

  const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
  const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

  if (endTimestamp <= startTimestamp) {
    throw new Error("End date must be after the start date.");
  }

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

/* ---------------- NOTIFICATIONS ---------------- */

/**
 * NEW: Event listener for real-time notifications
 */
export function listenForRentals(callback) {
  const contract = getReadContract();
  
  // Listens for the CarRented event emitted by the smart contract
  contract.on("CarRented", (carId, renter, startDate, endDate, paid, event) => {
    callback({
      carId: carId.toString(),
      renter,
      amount: ethers.formatEther(paid),
      timestamp: new Date().toLocaleTimeString(),
      txHash: event.log.transactionHash
    });
  });

  return () => contract.removeAllListeners("CarRented");
}

/* ---------------- HISTORY ---------------- */

export async function getRenterHistory(address) {
  const contract = getReadContract();
  return await contract.getRenterHistory(address);
}

export async function getOwnerHistory(address) {
  const contract = getReadContract();
  return await contract.getOwnerHistory(address);
}
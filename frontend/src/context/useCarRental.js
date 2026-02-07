import { ethers } from "ethers";
import artifact from "../abi/CarRental.json";
import { CONTRACT_ADDRESS, SEPOLIA_RPC } from "../abi/contract";

// Access the ABI from the Hardhat artifact structure
const ABI = artifact.abi;

/* ---------------- CONTRACT INSTANCES ---------------- */

/**
 * Creates a read-only contract instance using your centralized Alchemy RPC.
 * This automatically pulls from your .env file.
 */
export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

/**
 * Creates a write-capable contract instance using the user's MetaMask signer.
 */
export function getWriteContract(signer) {
  if (!signer) throw new Error("Signer required - Please connect MetaMask");
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

/* ---------------- READ HELPERS ---------------- */

/**
 * Fetches all cars from the blockchain and formats them for the UI.
 */
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
        location: car.pickupLocation, // Mapped to match ABI exactly
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

/**
 * Retrieves details for a specific active rental.
 */
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

  const tx = await contract.rentCar(carId, startDate, endDate, {
    value: ethers.parseUnits(totalEth.toString(), "ether"),
    gasLimit: 1000000 
  });

  return await tx.wait();
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
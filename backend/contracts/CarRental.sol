// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CarRental {
    uint256 public carCount;

    /* -------------------- ENUMS -------------------- */

    enum CarStatus {
        Available,     // 0
        Rented,        // 1
        Unavailable    // 2
    }

    /* -------------------- STRUCTS -------------------- */

    struct Car {
        uint256 id;
        address owner;
        string model;
        string pickupLocation;
        uint256 pricePerDay; // in wei
        CarStatus status;
        uint256 earnings;
    }

    struct Rental {
        uint256 carId;
        address renter;
        uint256 startDate;
        uint256 endDate;
        uint256 paid;
        bool active;
    }

    /* -------------------- STORAGE -------------------- */

    mapping(uint256 => Car) public cars;
    mapping(uint256 => Rental) public activeRental;
    mapping(address => Rental[]) private renterHistory;
    mapping(address => Rental[]) private ownerHistory;

    /* -------------------- EVENTS -------------------- */

    event CarRegistered(uint256 indexed carId, address indexed owner);
    event CarUpdated(uint256 indexed carId);
    event CarUnavailable(uint256 indexed carId);
    event CarRented(uint256 indexed carId, address indexed renter, uint256 startDate, uint256 endDate, uint256 paid);
    event RentalCancelled(uint256 indexed carId, address indexed renter, uint256 refunded);
    event RentalEnded(uint256 indexed carId);

    /* -------------------- OWNER FUNCTIONS -------------------- */

    function registerCar(
        string memory _model,
        string memory _pickupLocation,
        uint256 _pricePerDay
    ) external {
        require(_pricePerDay > 0, "Invalid price");

        carCount++;

        cars[carCount] = Car({
            id: carCount,
            owner: msg.sender,
            model: _model,
            pickupLocation: _pickupLocation,
            pricePerDay: _pricePerDay,
            status: CarStatus.Available,
            earnings: 0
        });

        emit CarRegistered(carCount, msg.sender);
    }

    function updateCarDetails(
        uint256 _carId,
        string memory _pickupLocation,
        uint256 _pricePerDay
    ) external {
        Car storage car = cars[_carId];
        require(car.owner == msg.sender, "Only owner");
        require(car.status == CarStatus.Available, "Car not editable");
        require(_pricePerDay > 0, "Invalid price");

        car.pickupLocation = _pickupLocation;
        car.pricePerDay = _pricePerDay;

        emit CarUpdated(_carId);
    }

    function setCarUnavailable(uint256 _carId) external {
        Car storage car = cars[_carId];
        require(car.owner == msg.sender, "Only owner");
        require(car.status == CarStatus.Available, "Car cannot be disabled");

        car.status = CarStatus.Unavailable;

        emit CarUnavailable(_carId);
    }

    function cancelRental(uint256 _carId) external {
        Car storage car = cars[_carId];
        require(car.owner == msg.sender, "Only owner");
        require(car.status == CarStatus.Rented, "Car not rented");

        Rental storage r = activeRental[_carId];
        require(r.active, "No active rental");

        r.active = false;
        car.status = CarStatus.Unavailable;

        (bool success, ) = payable(r.renter).call{value: r.paid}("");
        require(success, "Refund failed");

        emit RentalCancelled(_carId, r.renter, r.paid);
    }

    function endRental(uint256 _carId) external {
        Car storage car = cars[_carId];
        require(car.owner == msg.sender, "Only owner");
        require(car.status == CarStatus.Rented, "Not rented");

        Rental storage r = activeRental[_carId];
        require(block.timestamp >= r.endDate, "Rental still active");

        r.active = false;
        car.status = CarStatus.Available;

        emit RentalEnded(_carId);
    }

    /* -------------------- RENTER FUNCTIONS -------------------- */

    function rentCar(
        uint256 _carId,
        uint256 _startDate,
        uint256 _endDate
    ) external payable {
        Car storage car = cars[_carId];

        require(car.status == CarStatus.Available, "Car not available");
        require(_endDate > _startDate, "End date must be after start");

        uint256 daysRented = (_endDate - _startDate) / 1 days;
        require(daysRented > 0, "Minimum 1 day rental");

        uint256 totalCost = daysRented * car.pricePerDay;
        
        // Ensure user sent enough ETH
        require(msg.value >= totalCost, "Not enough ETH sent");

        car.status = CarStatus.Rented;
        car.earnings += totalCost;

        Rental memory rental = Rental({
            carId: _carId,
            renter: msg.sender,
            startDate: _startDate,
            endDate: _endDate,
            paid: totalCost,
            active: true
        });

        activeRental[_carId] = rental;
        renterHistory[msg.sender].push(rental);
        ownerHistory[car.owner].push(rental);

        // Send exactly the cost to the owner
        (bool ownerPaid, ) = payable(car.owner).call{value: totalCost}("");
        require(ownerPaid, "Owner payment failed");

        // If user sent too much, refund the excess balance
        if (msg.value > totalCost) {
            uint256 refundAmount = msg.value - totalCost;
            (bool refundSuccess, ) = payable(msg.sender).call{value: refundAmount}("");
            require(refundSuccess, "Refund failed");
        }

        emit CarRented(_carId, msg.sender, _startDate, _endDate, totalCost);
    }

    /* -------------------- VIEW FUNCTIONS -------------------- */

    function getRenterHistory(address user)
        external
        view
        returns (Rental[] memory)
    {
        return renterHistory[user];
    }

    function getOwnerHistory(address user)
        external
        view
        returns (Rental[] memory)
    {
        return ownerHistory[user];
    }
}
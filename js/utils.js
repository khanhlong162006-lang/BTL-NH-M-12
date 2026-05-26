const utils = {
    // Hàm 1: Kiểm tra form trống (Validation)
    isEmpty: (value) => {
        return value.trim() === "";
    },

    // Hàm 2: Kiểm tra ngân sách/giá tiền > 0 (Validation)
    isValidBudget: (budget) => {
        const num = Number(budget);
        return !isNaN(num) && num > 0;
    },

    // Hàm 3: Tính chia tiền đều bằng JS thuần
    calculateSplitExpense: (totalAmount, numberOfPeople) => {
        const people = Number(numberOfPeople);
        if (isNaN(people) || people <= 0) return 0;
        return Math.round(totalAmount / people);
    }
};
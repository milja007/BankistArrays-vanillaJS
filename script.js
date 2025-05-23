'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ``;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : ` withdrawal`;
    const html = ` <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}EUR</div>
    </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}EUR`;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
const updateUI = function (acc) {
  displayMovements(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};

// console.log(accounts);
// console.log(accounts);
//EVENT handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.getBoundingClientRect();
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  let receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = ``;
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = ``;
});
btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ``;
});
let sorted = false;
btnSort.addEventListener(`click`, function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// console.log(createUsernames(`Steven Thomas Williams`));

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about 
their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is 
an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create 
a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult
 ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉*/

// let Julisdata1 = [3, 5, 2, 12, 7];
// let Katedata1 = [4, 1, 15, 8, 3];
// let Juliadata2 = [9, 16, 6, 8, 3];
// let Katedata2 = [10, 5, 6, 1, 4];
// const checkDogs = function (dogsJulia, dogsKate) {
//   const onlydogsJ = Julisdata1.slice(1, 3);
//   const svipsi = onlydogsJ.concat(Katedata1);
//   svipsi.forEach(function (element, i) {
//     if (element >= 3) {
//       console.log(`${i + 1} pesek ${element} godina ima i proglašen je Dedom`);
//     } else {
//       console.log(
//         `${i + 1} pesek ${element} godina ima i proglašen je Derištem`
//       );
//     }
//   });
// };
// // checkDogs(Julisdata1, Katedata1);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurotousd = 1.1;
const movementsusd = movements.map(function (mov) {
  return mov * eurotousd;
});

// console.log(movements);
// console.log(movementsusd);
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
// console.log(max);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets
*/
// const T1 = [5, 2, 4, 1, 15, 8, 3];
// const T2 = [16, 6, 10, 5, 6, 1, 4];
// // arr.filter(function(elem){return elem>0})

// const calcAverageHumanAge = function (ages) {
//   const human = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   const notunderaged = human.filter(elem => elem >= 18);
//   const calcAverageHumanAgeAdDog = notunderaged.reduce(
//     (acc, god, i, arr) => acc + god / arr.length,
//     0
//   );
//   return calcAverageHumanAgeAdDog;
// };
// console.log(calcAverageHumanAge(T1));
// console.log();
// // const calcAverageHumanAge = function (ages) {
//   const humana = ages.map(age => {
//     if (age <= 2) return (age = age * 2);
//     else if (age > 2) return (age = 16 + age * 4);
//   });
//   return humana;
// };
const euroToUsd = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    return mov * euroToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// const T1 = [5, 2, 4, 1, 15, 8, 3];
// const T2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(elem => elem >= 18)
//     .reduce((acc, god, i, arr) => acc + god / arr.length, 0);

// console.log(calcAverageHumanAge(T1));
// const firstWithdrawal = movements.find(mov => mov < 0);
// // console.log(movements);
// // console.log(firstWithdrawal);
// // console.log(accounts);
// const account = accounts.find(acc => acc.owner === `Jessica Davis`);
// console.log(account);
// for (const elem of accounts) {
//   if (elem.owner === `Jessica Davis`) {
//     // console.log(elem);
//   }
// }
// FOR OF LOOP-for (const element of arr)
//    {if(a>b){} else{}}
// // Code to execute for each element
// The for...of loop in JavaScript
//  is a simplified way to iterate over
// iterable objects, such as arrays,
//  strings, maps, sets
// console.log(movements.includes(-130));
// const anyDeposits = movements.some(mov => mov > 5000);
// console.log(anyDeposits);

// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// // const min1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(acc => acc >= 1000).length;

// const min1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(min1000);

// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? `deposits` : `withdrawals`] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// const convertitle = function (title) {
//   const expections = [`a`, `an`, `the`, `but`, `or`, `on`, `in`, `with`];
//   const titleCase = title
//     .toLowerCase()
//     .split(` `)
//     .map(word =>
//       expections.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(` `);
//   return titleCase;
// };
// console.log(convertitle(`this is a nice title`));
// console.log(convertitle(`this is a LONG title but not to long`));

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this 
time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food 
portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current
 food portion is within a range 10% above and 10% below the
  recommended portion (see hint).

  

1. Loop over the array containing dog objects, and for
 each dog, calculate the recommended food portion and add it
  to the object as a new property. Do NOT create a new array,
   simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28.
    (The result is in grams of food, and the weight needs to be in kg)*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
});

console.log(dogs);

dogs
  .filter(dog => dog.owners.includes('Sarah')) // Find dogs owned by Sarah (in case there are multiple)
  .forEach(dog => {
    console.log(
      dog.curFood > dog.recommendedFood * 0.9 &&
        dog.curFood < dog.recommendedFood * 1.1
        ? 'Eating nice'
        : dog.curFood < dog.recommendedFood * 0.9
        ? 'Eating too little'
        : 'Eating too much'
    );
  });

const skupLittle = dogs
  .filter(dogi => dogi.curFood < dogi.recommendedFood * 0.9)
  .flatMap(acc => acc.owners);

const skupMuch = dogs
  .filter(dogi => dogi.curFood > dogi.recommendedFood * 1.1)
  .flatMap(acc => acc.owners);

console.log(skupLittle);

console.log(`${skupMuch.join(` and `)}"s dogs eat too much`);
console.log(`${skupLittle.join(` and `)}"s dogs eat too little`);

//   5. Log to the console whether there is any

//  EXACTLY the amount of food that is recommended (just true or false)
console.log(dogs.includes(dogs.curFood === dogs.recommendedFood));
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

//  means: current > (recommended * 0.90) && current < (recommended * 1.10).
//  6. Log to the console whether there is any dog eating an
//  OKAY amount of food (just true or false)

//  7. Create an array containing the dogs that are eating an
//  OKAY amount of food (try to reuse the condition used in 6.)
const oks = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(oks);
//  8. Create a shallow copy of the dogs array and sort it
//  by recommended food portion in an ascending order
//  (keep in mind that the portions are inside the array's objects)
const doggyss = [...dogs].sort((a, b) => b.recommendedFood - a.recommendedFood);

console.log(doggyss);
//  TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];

// HINT 1: Use many different tools to solve these challenges,
//  you can use the summary lecture to choose between them 😉

//  HINT 2: Being within a range 10% above and below the
// recommended portion
//  means: current > (recommended * 0.90) && current < (recommended * 1.10).
//   Basically, the current portion should be between 90% and 110% of the recommended portion.*/

'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-07-26T17:01:17.194Z',
        '2022-02-04T02:36:17.929Z',
        '2022-02-03T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

function formatCur(num, locale, currency) {
    return Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(num);
}

let currentAccount, timer;
const now = new Date();
const dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
};
const defLocale = navigator.language;

const displayMovements = (acc, sort = false) => {
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movs.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const displayDate = dateGenerator(date, acc.locale);

        const formattedMov = formatCur(mov, acc.locale, acc.currency);

        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMov}</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

// create user name
const createUserName = (user) => {
    return user
        .toLowerCase()
        .split(' ')
        .map((name) => name[0])
        .join('');
};

// push user name to each user object
accounts.forEach((acc) => {
    acc.usename = createUserName(acc.owner);
});

// calculate balance
const calcDisplayBalance = (movements) => {
    return movements.reduce((acc, amt) => acc + amt, 0);
};

//find max value
// const max = accounts[0].movements.reduce((acc, amt) => (acc > amt ? acc : amt), accounts[0].movements[0]);

const calcDisplaySummary = (movements, fn) => {
    return movements.filter(fn).reduce((acc, curr) => acc + curr, 0);
};

const calcInterest = (movements, intRate) => {
    return movements
        .filter((amt) => amt > 0)
        .map((amt) => (amt * intRate) / 100)
        .filter((int) => int >= 1)
        .reduce((acc, int) => acc + int);
};

// fake login
// currentAccount = account1;
// containerApp.style.opacity = 100;
// updateUI();
// labelDate.textContent = dateGenerator(now, defLocale, true);
//********//

// start logout timer function
const startLogoutTimer = () => {
    let time = 60; //100 sec

    const tick = () => {
        const min = `${Math.trunc(time / 60)}`.padStart(2, '0');
        const sec = `${time % 60}`.padStart(2, '0');
        labelTimer.textContent = `${min}:${sec}`;

        //stop timer when 0
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = `log to get started`;
            containerApp.style.opacity = 0;
        }
        time--;
    };

    timer = setInterval(tick, 1000);
    return timer;
};

// set current date
function dateGenerator(date, locate = defLocale, time = false) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

    const dayPassed = calcDaysPassed(new Date(), date);

    if (dayPassed === 0 && !time) return 'today';
    if (dayPassed === 1 && !time) return 'yesterday';
    if (dayPassed <= 7 && !time) return `${dayPassed} days ago.`;
    if (time) return new Intl.DateTimeFormat(locate, dateOptions).format(date);
    else return new Intl.DateTimeFormat(locate).format(date);
}

// add login event listner
btnLogin.addEventListener('click', (event) => {
    event.preventDefault();
    currentAccount = accounts.find((acc) => acc.usename === inputLoginUsername.value);

    if (currentAccount?.pin === +inputLoginPin.value) {
        console.log('Login');
        // display welcome message
        labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;

        containerApp.style.opacity = 100;

        //display date
        // labelDate.textContent = dateGenerator(now, true);
        labelDate.textContent = dateGenerator(now, currentAccount.locale, true);

        //clear input field
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        updateUI();

        if (timer) {
            clearInterval(timer);
        }
        timer = startLogoutTimer();
    }
});

function updateUI() {
    displayMovements(currentAccount);
    currentAccount.balance = calcDisplayBalance(currentAccount.movements);
    labelBalance.textContent = formatCur(
        currentAccount.balance,
        currentAccount.locale,
        currentAccount.currency
    );
    const deposit = calcDisplaySummary(currentAccount.movements, (mov) => mov > 0);
    const withdrawal = Math.abs(calcDisplaySummary(currentAccount.movements, (mov) => mov < 0));
    const int = calcInterest(currentAccount.movements, currentAccount.interestRate);

    labelSumIn.textContent = formatCur(deposit, currentAccount.locale, currentAccount.currency);
    labelSumOut.textContent = formatCur(withdrawal, currentAccount.locale, currentAccount.currency);
    labelSumInterest.textContent = formatCur(int, currentAccount.locale, currentAccount.currency);
}

// transfer part
btnTransfer.addEventListener('click', (event) => {
    event.preventDefault();
    const amt = +inputTransferAmount.value;
    const receiverAcc = accounts.find((acc) => acc.usename === inputTransferTo.value);
    console.log(receiverAcc);

    if (
        amt > 0 &&
        currentAccount.balance >= amt &&
        receiverAcc &&
        receiverAcc?.usename !== currentAccount.usename
    ) {
        currentAccount.movements.push(-amt);
        currentAccount.movementsDates.push(now.toISOString());

        receiverAcc.movements.push(amt);
        receiverAcc.movementsDates.push(now.toISOString());

        updateUI();

        //reset timer
        clearInterval(timer);
        timer = startLogoutTimer();
    }

    // cleaning field
    inputTransferTo.value = inputTransferAmount.value = '';
});

// close account
btnClose.addEventListener('click', (event) => {
    event.preventDefault();

    if (inputCloseUsername.value === currentAccount.usename && +inputClosePin.value === currentAccount.pin) {
        const idx = accounts.findIndex((acc) => acc.usename === currentAccount.usename);
        accounts.splice(idx, 1);
        console.log('Deleted : ' + inputCloseUsername.value);
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

// loan section
btnLoan.addEventListener('click', (event) => {
    event.preventDefault();
    const amt = Math.floor(inputLoanAmount.value);
    const loanAble = currentAccount.movements.some((mov) => mov >= amt * 0.1);

    if (amt > 0 && loanAble) {
        setTimeout(() => {
            currentAccount.movements.push(amt);
            currentAccount.movementsDates.push(now.toISOString());
            updateUI();
        }, 3000);
        console.log('Loan is requesting..');
    }
    inputLoanAmount.value = '';

    //reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
});

// sorting button
let sorted = false;
btnSort.addEventListener('click', (event) => {
    event.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});

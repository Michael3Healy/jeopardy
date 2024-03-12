let categoryIds = [2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18];
let baseUrl = 'https://rithm-jeopardy.herokuapp.com/api';
const startButton = document.querySelector('button');

startButton.addEventListener('click', setupAndStart);

// shuffles the Ids of the categories
function shuffleCategoryIds() {
	for (let i = categoryIds.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[categoryIds[i], categoryIds[randomIndex]] = [categoryIds[randomIndex], categoryIds[i]];
	}
}

// Returns an array of 6 categories
function getCategoryIds() {
	shuffleCategoryIds();
	return categoryIds.slice(0, 6);
}

// Return object with data about a category
async function getCategory(catId) {
	return await axios.get(`${baseUrl}/category?id=${catId}`);
}

// Creates HTML table elements and adds appropriate classes; IDs used for tracking which category goes in which column and td
function createTable() {
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const tbody = document.createElement('tbody');
	const headRow = document.createElement('tr');
	table.classList.add('hidden');
	headRow.classList.add('table-head');
	thead.append(headRow);

	// Creates row containing titles of categories
	for (let i = 0; i < 6; i++) {
		const td = document.createElement('td');
		td.setAttribute('id', `${i}`);
		headRow.append(td);
	}

	// Creates table body for questions/answers
	for (let i = 0; i < 5; i++) {
		const tr = document.createElement('tr');
		tr.classList.add('table-body');
		for (let i = 0; i < 6; i++) {
			const td = document.createElement('td');
			const questionMark = document.createElement('p');
			questionMark.innerText = '?';
			questionMark.classList.add('very-large');
			td.setAttribute('id', `${i}`);
			td.append(questionMark);
			tr.append(td);
		}
		tbody.append(tr);
	}
	table.append(thead);
	table.append(tbody);
	table.addEventListener('click', toggleQuestion);
	$('body').append(table);
}

// Fills already created HTML table with info from API
async function fillTable() {
	let shuffledCategoryIds = getCategoryIds();
	const headRow = document.querySelector('tr.table-head');
	const columnHeaders = headRow.querySelectorAll('td');
	for (let column of columnHeaders) {
		const columnTitle = document.createElement('p');
		const categoryId = shuffledCategoryIds[column.id];
		const category = await axios.get(`${baseUrl}/category?id=${categoryId}`);
		const categoryTitle = category.data.title;
		columnTitle.innerText = categoryTitle;
		column.append(columnTitle);
	}

	const allBodyRows = document.querySelectorAll('tr.table-body');
	for (let i = 0; i < allBodyRows.length; i++) {
		const tdsInRow = allBodyRows[i].querySelectorAll('td');

		// Adds p elements with corresponding classes to differentiate between question and answer when clicking elements
		for (let td of tdsInRow) {
			const questionP = document.createElement('p');
			questionP.classList.add('question');
			questionP.classList.add('hidden');
			const answerP = document.createElement('p');
			answerP.classList.add('answer');
			answerP.classList.add('hidden');

			td.append(questionP);
			td.append(answerP);

			const categoryId = shuffledCategoryIds[td.id];
			const category = await axios.get(`${baseUrl}/category?id=${categoryId}`);
			const question = category.data.clues[i].question;
			const answer = category.data.clues[i].answer;
			questionP.innerText = question;
			answerP.innerText = answer;
		}
	}
	hideLoadingView();
}

// Handles clicking on a clue: show the question or answer based on element class
function toggleQuestion(evt) {
	if (evt.target.classList.contains('very-large')) {
		evt.target.classList.remove('very-large');
		evt.target.classList.add('hidden');
		const question = evt.target.parentElement.querySelector('p.question');
		question.classList.remove('hidden');
	}

	if (evt.target.classList.contains('question')) {
		evt.target.classList.add('hidden');
		const answer = evt.target.parentElement.querySelector('p.answer');
		answer.classList.remove('hidden');
	}
}

// Hides start button, creates and shows loading spinner
function showLoadingView() {
	startButton.classList.add('hidden');
	loadingSpinner = document.createElement('i');
	loadingSpinner.classList.add('fa-solid', 'fa-spinner', 'fa-spin-pulse');
	$('body').append(loadingSpinner);
}

// Removes loading spinner and shows restart button
function hideLoadingView() {
	loadingSpinner.style.display = 'none';
	$('table').removeClass('hidden');
	startButton.classList.remove('hidden', 'start');
	startButton.classList.add('restart');
	startButton.innerText = 'Restart';
}

// Starts game by calling necessary functions
async function setupAndStart(evt) {
	try {
		// If the restart button triggered the event, empties page except for button and adds new event listener
		if (document.querySelector('table')) {
			document.querySelector('body').innerHTML = '<button class="restart">Restart</button>';
			document.querySelector('button').addEventListener('click', setupAndStart);
		}
		showLoadingView();
		createTable();
		await fillTable();
	} catch (error) {
		showError();
	}
}

function showError() {
	const errorMessage = document.createElement('h1');
	errorMessage.classList.add('error');
	errorMessage.innerText = 'An error occurred while processing your request';
	$('body').empty()
	document.querySelector('body').append(errorMessage);
	
}

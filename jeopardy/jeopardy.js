let categoryIds = [2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18];
let baseUrl = 'https://rithm-jeopardy.herokuapp.com/api';
let shuffledCategoryIds = getCategoryIds();

function shuffleCategoryIds() {
	for (let i = categoryIds.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[categoryIds[i], categoryIds[randomIndex]] = [categoryIds[randomIndex], categoryIds[i]];
	}
}

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds() {
	shuffleCategoryIds();
	return categoryIds.slice(0, 6);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
	return await axios.get(`${baseUrl}/category?id=${catId}`);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function createTable() {
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const tbody = document.createElement('tbody');
	const headRow = document.createElement('tr');
	headRow.classList.add('table-head');
	thead.append(headRow);
	for (let i = 0; i < 6; i++) {
		const td = document.createElement('td');
		td.setAttribute('id', `${i}`);
		headRow.append(td);
	}
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

async function fillTable() {
	const headRow = document.querySelector('tr.table-head');
	const columnHeaders = headRow.querySelectorAll('td');
	for (let column of columnHeaders) {
		const columnTitle = document.createElement('p');
		const categoryId = shuffledCategoryIds[column.id];
		const category = await axios.get(`${baseUrl}/category?id=${categoryId}`);
		const categoryTitle = category.data.title;
		columnTitle.innerText = categoryTitle;
		column.append(columnTitle)
	}
	
	const allBodyRows = document.querySelectorAll('tr.table-body');
	for (let i = 0; i < allBodyRows.length; i++) {
		const tdsInRow = allBodyRows[i].querySelectorAll('td');
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
	
}

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

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */
createTable();
fillTable();
async function setupAndStart() {
	createTable();
	fillTable();
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

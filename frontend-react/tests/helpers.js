// Test constants and helper functions
export const TEST_CREDENTIALS = {
	email: 'dhanjoenkp@gmail.com',
	password: 'qweqwe'
};

export const TEST_BOOKS = {
	book1: {
		title: 'The Great Gatsby',
		author: 'F. Scott Fitzgerald'
	},
	book2: {
		title: 'To Kill a Mockingbird',
		author: 'Harper Lee'
	},
	book3: {
		title: 'Pride and Prejudice',
		author: 'Jane Austen'
	}
};

export const SELECTORS = {
	// Auth selectors
	emailInput: '#email',
	passwordInput: '#password',
	loginButton: 'button[type="submit"]',
	registerTab: 'button[aria-selected="false"]',
	loginTab: 'button[aria-selected="true"]',
	welcomeUser: '#welcome-user',
	logoutButton: 'text=Logout',

	// Book form selectors
	titleInput: '#title',
	authorInput: '#author',
	addBookButton: 'text=📚 Add Book',

	// Book card selectors
	bookCard: '.book-card',
	bookTitle: '.book-title',
	bookAuthor: '.book-author',
	editButton: 'text=✏️ Edit',
	deleteButton: 'text=🗑️ Delete',
	saveButton: 'text=💾 Save',
	cancelButton: 'text=❌ Cancel',

	// Modal selectors
	deleteModal: '.modal-overlay',
	confirmDeleteButton: 'text=🗑️ Delete',
	cancelDeleteButton: 'text=❌ Cancel',

	// Common selectors
	loadingSpinner: '.spinner',
	errorMessage: '.error-message',
	successMessage: '.success-message',
	emptyState: '.books-empty'
};

export const URLS = {
	home: '/',
	dashboard: '/'
};

export const TIMEOUTS = {
	short: 5000,
	medium: 10000,
	long: 30000
};

// Helper function to login
export async function login(page, credentials = TEST_CREDENTIALS) {
	await page.goto('/');
	await page.fill(SELECTORS.emailInput, credentials.email);
	await page.fill(SELECTORS.passwordInput, credentials.password);
	await page.click(SELECTORS.loginButton);

	// Wait for successful login
	await page.waitForSelector(SELECTORS.welcomeUser, { timeout: TIMEOUTS.medium });
}

// Helper function to logout
export async function logout(page) {
	await page.click(SELECTORS.logoutButton);
	await page.waitForSelector(SELECTORS.emailInput, { timeout: TIMEOUTS.medium });
}

// Helper function to add a book
export async function addBook(page, book) {
	await page.fill(SELECTORS.titleInput, book.title);
	await page.fill(SELECTORS.authorInput, book.author);
	await page.click(SELECTORS.addBookButton);

	// Wait for form to reset (indicating success)
	await page.waitForFunction(() => {
		const titleInput = document.querySelector('#title');
		return titleInput && titleInput.value === '';
	}, { timeout: TIMEOUTS.medium });
}

// Helper function to wait for page load
export async function waitForPageLoad(page) {
	await page.waitForLoadState('networkidle');
}

// Helper function to take screenshot with timestamp
export async function takeScreenshot(page, name) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	await page.screenshot({
		path: `test-results/screenshots/${name}-${timestamp}.png`,
		fullPage: true
	});
}

// Helper function to clear all books
export async function clearAllBooks(page) {
	// Wait for page to be ready
	await page.waitForTimeout(1000);

	// Check if there are any books to delete
	const bookCards = page.locator(SELECTORS.bookCard);
	let count = await bookCards.count();

	// Delete all books one by one
	while (count > 0) {
		// Always delete the first book since the list updates after each deletion
		const firstCard = bookCards.first();
		const deleteButton = firstCard.locator(SELECTORS.deleteButton);

		if (await deleteButton.isVisible()) {
			await deleteButton.click();

			// Wait for modal and click the confirm button inside the modal
			await page.waitForSelector(SELECTORS.deleteModal, { timeout: TIMEOUTS.short });
			await page.locator(SELECTORS.deleteModal).locator(SELECTORS.confirmDeleteButton).click();

			// Wait for the book to be removed
			await page.waitForTimeout(1000);

			// Update count
			count = await bookCards.count();
		} else {
			break; // No more delete buttons visible
		}
	}
}

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Entity Classification Tool', () => {

  test.beforeEach(async ({ page }) => {
    // Step 1: Login to the application
    await page.goto('https://platform.natif.ai/login');
    await page.getByRole('button', { name: 'Accept all' }).click();
    await page.fill('#login-email', 'tobi.aremu06@yahoo.com');
    await page.fill('#login-password', 'Testing1234!');
    await page.click('button[type="submit"]');
    await page.locator('[data-test-id="close"]').click();
    await expect(page).toHaveURL('https://platform.natif.ai/api-hub');

    // Step 2: Navigate to the "Create Custom Extraction" tool, and fill all required data
    await page.locator('[data-test-id="create-card-custom_extraction"]').getByRole('img').click();
    await expect(page).toHaveURL('https://platform.natif.ai/api-hub/create-extraction-model');
    await page.getByPlaceholder('Give your workflow a name').fill('test5');
    await page.locator('[data-test-id="apiDescription"] div').nth(2).click();
    await page.locator('[data-test-id="apiDescription"] div').nth(2).fill('test2 description');
    await page.locator('[data-test-id="next-step-button"]').click();
    await page.getByLabel('Always perfectly cropped').check();
    await page.getByLabel('Only printed text').check();
    await page.getByLabel('Latin (supported Languages:').check();
    await page.locator('[data-test-id="next-step-button"]').click();
    await page.locator('[data-test-id="info-basic-field-types-row"] div').filter({ hasText: 'Free Text' }).nth(3).click();
    await page.locator('[data-test-id="button-add-field-_root"]').click();
    await page.getByPlaceholder('Enter a name').click();
    await page.getByPlaceholder('Enter a name').fill('QA_task');
    await page.locator('[data-test-id="register-field-types-row"] div').filter({ hasText: 'Free Text' }).nth(3).click();
    await page.locator('[data-test-id="modal-ok-button"]').click();
    await page.locator('[data-test-id="next-step-button"]').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.locator('[data-test-id="add-new-issuer"]').click();
    await page.getByRole('button', { name: 'Browse Documents' }).click(); // in real live we can implement a logic to upload file here
    // Path to the file that you want to upload
    const filePath = path.resolve(__dirname, 'sampleFile.txt');  // Ensure 'sampleFile.txt' exists

    // Locate the input element (input[type="file"]) and upload the file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Optionally, verify that the file upload worked (specific to your app)
    const uploadedFileName = await page.locator('.uploaded-file-name');  // Replace with your app's locator
    await expect(uploadedFileName).toHaveText('sampleFile.txt');

    await page.locator('div').filter({ hasText: /^Submit$/ }).click();
    await page.locator('div').filter({ hasText: 'Add new templateTemplate' }).nth(2).click();
  });

  // Test Case 1: Assign color using clicking
  test('Assign color using clicking', async ({ page }) => {
    await selectColor(page, 'Red');
    await page.click('locator-for-box1'); // Replace with actual locator for the box
    const boxColor = await getBoxColor(page, 'locator-for-box1');
    expect(boxColor).toBe('Red');
  });

  // Test Case 2: Assign color using drawing
  test('Assign color using drawing', async ({ page }) => {
    await selectColor(page, 'Blue');
    await drawOverBox(page, 'locator-for-box2'); // Replace with the actual drawing method
    const boxColor = await getBoxColor(page, 'locator-for-box2');
    expect(boxColor).toBe('Blue');
  });

  // Test Case 3: Overwrite color
  test('Overwrite color', async ({ page }) => {
    await selectColor(page, 'Green');
    await page.click('locator-for-box1'); // Replace with actual locator
    const boxColor = await getBoxColor(page, 'locator-for-box1');
    expect(boxColor).toBe('Green');
  });

  // Test Case 4: Assign types
  test('Assign types to a box', async ({ page }) => {
    await selectType(page, 'TypeA');
    await assignTypeToBox(page, 'locator-for-box1');
    const boxType = await getBoxType(page, 'locator-for-box1');
    expect(boxType).toBe('TypeA');
  });

  // Test Case 5: Assign groups
  test('Assign groups to boxes', async ({ page }) => {
    await selectBoxes(page, ['locator-for-box1', 'locator-for-box2', 'locator-for-box3']);
    await groupBoxes(page, 'Group1');
    const box1Group = await getBoxGroup(page, 'locator-for-box1');
    const box2Group = await getBoxGroup(page, 'locator-for-box2');
    expect(box1Group).toBe('Group1');
    expect(box2Group).toBe('Group1');
  });

  // Test Case 6: Auto-group ungrouped boxes
  test('Auto-group ungrouped boxes', async ({ page }) => {
    await createUngroupedBoxes(page, ['locator-for-box4', 'locator-for-box5']);
    await triggerAutoGrouping(page);
    const box4Group = await getBoxGroup(page, 'locator-for-box4');
    const box5Group = await getBoxGroup(page, 'locator-for-box5');
    expect(box4Group).toBe('AutoGrouped');
    expect(box5Group).toBe('AutoGrouped');
  });

  // Test Case 7: Verify grouping rules
  test('Verify grouping rules for different categories', async ({ page }) => {
    await selectBoxes(page, ['locator-for-box1', 'locator-for-box6']);
    await expectErrorWhenGrouping(page);
  });

  // Test Case 8: Verify number badges for types
  test('Verify number badges for types and groups', async ({ page }) => {
    await assignTypeToBox(page, 'locator-for-box7', 'TypeB');
    await verifyBadgeCount(page, 'TypeB', 1);
    await assignTypeToBox(page, 'locator-for-box8', 'TypeB');
    await verifyBadgeCount(page, 'TypeB', 2);
  });
});

// Utility functions
async function selectColor(page, color: string) {
  await page.click(`locator-for-color-picker-${color}`); // Replace with actual locator
}

async function drawOverBox(page, boxLocator: string) {
  // Implement drawing logic, e.g., mouse movement over box
  await page.mouse.move(100, 100); // Start point
  await page.mouse.down();
  await page.mouse.move(200, 200); // End point
  await page.mouse.up();
}

async function getBoxColor(page, boxLocator: string): Promise<string> {
  return await page.locator(boxLocator).evaluate(box => box.style.backgroundColor);
}

async function selectType(page, type: string) {
  await page.click(`locator-for-type-${type}`); // Replace with actual locator
}

async function assignTypeToBox(page, boxLocator: string) {
  await page.click(boxLocator); // Assign type by clicking
}

async function getBoxType(page, boxLocator: string): Promise<string> {
  return await page.locator(boxLocator).textContent(); // Assuming type is displayed as text
}

async function selectBoxes(page, boxLocators: string[]) {
  for (const boxLocator of boxLocators) {
    await page.click(boxLocator); // Select multiple boxes
  }
}

async function groupBoxes(page, groupName: string) {
  await page.fill('locator-for-group-name-input', groupName); // Fill group name
  await page.click('locator-for-group-confirm-button'); // Confirm grouping
}

async function getBoxGroup(page, boxLocator: string): Promise<string> {
  return await page.locator(boxLocator).evaluate(box => box.getAttribute('data-group')); // Assuming group is stored as an attribute
}

async function createUngroupedBoxes(page, boxLocators: string[]) {
  for (const boxLocator of boxLocators) {
    await page.click(boxLocator); // Create ungrouped boxes
  }
}

async function triggerAutoGrouping(page) {
  await page.click('locator-for-auto-grouping-button'); // Trigger auto-grouping
}

async function expectErrorWhenGrouping(page) {
  const errorMessageLocator = page.locator('locator-for-error-message');
  await expect(errorMessageLocator).toBeVisible(); // Expect error message to be shown
}

async function verifyBadgeCount(page, type: string, expectedCount: number) {
  const badgeCountLocator = page.locator(`locator-for-badge-${type}`);
  const actualCount = await badgeCountLocator.textContent();
  expect(parseInt(actualCount)).toBe(expectedCount);
}

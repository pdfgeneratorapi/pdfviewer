import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { test, expect, Page } from '@playwright/test';

const IFRAME_ID = 'id-iframe';
const REMOTE_DOCUMENT = path.resolve(__dirname, 'load_remote_document.html');
const BASE64_DOCUMENT = path.resolve(__dirname, 'load_base64_document.html');
const EMPTY_DOCUMENT = path.resolve(__dirname, 'empty_document.html');

test('loads document from URL', async ({ page }) => {
  await page.goto(`file://${REMOTE_DOCUMENT}`);
  await testToolbar(page);
});

test('loads base64 encoded document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);
  await testToolbar(page);
});

test('adds a typed signature to the document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  await iframe.getByRole('button', { name: 'Signature' }).click();

  const signatureModal = iframe.getByRole('dialog');
  const signatureCanvas = signatureModal.getByRole('textbox', { name: 'Type your signature' });
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add' });
  const signature = iframe.locator('.resizers');

  await expect(signatureModal.getByText('Add a signature')).toBeVisible();
  await signatureCanvas.fill("Signature");

  await signatureAddButton.click();
  await expect(signature).toBeVisible();
});

test('adds a drawn signature to the document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  await iframe.getByRole('button', { name: 'Signature' }).click();

  const signatureModal = iframe.getByRole('dialog');
  const signatureCanvas = signatureModal.getByRole('img', { name: 'Draw your signature' });
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add', exact: true });
  const signatureDrawTab = signatureModal.getByRole('tab', { name: 'Draw', exact: true });
  const signature = iframe.locator('.resizers');

  await expect(signatureModal.getByText('Add a signature')).toBeVisible();
  await signatureDrawTab.click();

  await expect(signatureCanvas).toBeVisible();

  const svgElement = await signatureCanvas.elementHandle();
  const signatureBox = await svgElement?.boundingBox();

  if (!signatureBox) {
    throw new Error('The drawing canvas is not rendered.');
  }

  const { x, y, width, height } = signatureBox;
  const startX = x + width / 4;
  const startY = y + height / 2;
  const endX = x + (3 * width) / 4;
  const endY = y + height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();

  await signatureAddButton.click();
  await expect(signature).toBeVisible();
});

test('adds an uploaded image signature to the document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  await iframe.getByRole('button', { name: 'Signature' }).click();

  const signatureModal = iframe.getByRole('dialog');
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add' });
  const signatureImageTab = signatureModal.getByRole('tab', { name: 'Image', exact: true });
  const signatureUploadButton = iframe.getByText('Or browse image files');
  const signature = iframe.locator('.resizers');

  await expect(signatureModal.getByText('Add a signature')).toBeVisible();
  await signatureImageTab.click();

  const uploadPromise = page.waitForEvent('filechooser');
  await signatureUploadButton.click();
  const fileChooser = await uploadPromise;
  await fileChooser.setFiles(path.join(__dirname, 'logo.gif'));

  await signatureAddButton.click();
  await expect(signature).toBeVisible();
});

test('removes the signature', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  await iframe.getByRole('button', { name: 'Signature' }).click();

  const signatureModal = iframe.getByRole('dialog');
  const signatureCanvas = signatureModal.getByRole('textbox', { name: 'Type your signature' });
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add' });
  const signatureRemoveButton = iframe.getByRole('toolbar');
  const signature = iframe.locator('.resizers');

  await expect(signatureModal.getByText('Add a signature')).toBeVisible();
  await signatureCanvas.fill("Signature");

  await signatureAddButton.click();
  await expect(signature).toBeVisible();

  await signatureRemoveButton.click();
  await expect(signature).toBeHidden();
});

test('prints a document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const printButton = page.locator(`#${IFRAME_ID}`).contentFrame().getByRole('button', { name: 'Print' });

  await page.evaluate(`(() => {
      const iframe = document.getElementById("${IFRAME_ID}");
      window.waitForPrintDialog = new Promise(f => iframe.contentWindow.print = f);
    })()`);
  await printButton.click();

  await page.waitForFunction('window.waitForPrintDialog');
});

test('saves a document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const saveButton = page.locator(`#${IFRAME_ID}`).contentFrame().getByRole('button', { name: 'Save' });

  const downloadPromise = page.waitForEvent('download');
  await saveButton.click();
  const download = await downloadPromise;

  const savedFilePath = path.resolve(__dirname) + download.suggestedFilename();
  await download.saveAs(savedFilePath);

  const savedFile = (await fs.stat(savedFilePath)).isFile();
  expect(savedFile).toBeTruthy();

  await fs.rm(savedFilePath);
});

test('uploads a document', async ({ page }) => {
  await page.goto(`file://${EMPTY_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const toolbar = iframe.locator('#toolbarViewer');
  const uploadButton = toolbar.getByRole('button', { name: 'Upload' });
  const uploadPromise = page.waitForEvent('filechooser');

  await uploadButton.click();

  const fileChooser = await uploadPromise;
  await fileChooser.setFiles(path.join(__dirname, 'certificate.pdf'));

  const fileData = iframe.getByText('CERTIFICATE', { exact: true })
  await expect(fileData).toBeVisible();
});

test('uploads a document via action button', async ({ page }) => {
  await page.goto(`file://${EMPTY_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const emptyStateContainer = iframe.locator('#emptyStateContainer');
  const actionButton = emptyStateContainer.getByRole('button', { name: 'Upload' });
  const uploadPromise = page.waitForEvent('filechooser');

  await expect(emptyStateContainer).toBeVisible();

  await actionButton.click();

  const fileChooser = await uploadPromise;
  await fileChooser.setFiles(path.join(__dirname, 'certificate.pdf'));

  await expect(emptyStateContainer).toBeHidden();

  const fileData = iframe.getByText('CERTIFICATE', { exact: true })
  await expect(fileData).toBeVisible();
});

const testToolbar = async (page: Page) => {
  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const toolbar = iframe.locator('#toolbarViewer');
  const sidebar = iframe.locator('#thumbnailView');
  const findbar = iframe.locator('#findbar');
  const sidebarButton = toolbar.getByRole('button', { name: 'Toggle Sidebar' });
  const findbarButton = toolbar.getByRole('button', { name: 'Find' })
  const printButton = toolbar.getByRole('button', { name: 'Print' });
  const saveButton = toolbar.getByRole('button', { name: 'Save' });
  const uploadButton = toolbar.getByRole('button', { name: 'Upload' });

  await expect(page).toHaveTitle("Test");
  await expect(sidebar).toBeVisible();
  await expect(findbar).toBeHidden();

  await expect(sidebarButton).toBeVisible();
  await expect(toolbar.getByRole('button', { name: 'Previous' })).toBeVisible();
  await expect(toolbar.getByRole('button', { name: 'Next' })).toBeVisible();
  await expect(findbarButton).toBeVisible();
  await expect(toolbar.getByRole('button', { name: 'Zoom Out' })).toBeVisible();
  await expect(toolbar.locator('#scaleSelect')).toBeVisible();
  await expect(toolbar.getByRole('button', { name: 'Zoom In' })).toBeVisible();
  await expect(printButton).toBeVisible();
  await expect(saveButton).toBeVisible();
  await expect(uploadButton).toBeVisible();

  await sidebarButton.click();
  await expect(sidebar).toBeHidden();

  await findbarButton.click();
  await expect(findbar).toBeVisible();
};

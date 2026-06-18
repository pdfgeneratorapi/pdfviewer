import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { Browser, expect, Page, test } from '@playwright/test';

const IFRAME_ID = 'id-iframe';
const REMOTE_DOCUMENT = path.resolve(__dirname, 'load_remote_document.html');
const BASE64_DOCUMENT = path.resolve(__dirname, 'load_base64_document.html');
const BASE64_DOCUMENT_WITHOUT_SIDEBAR = path.resolve(__dirname, 'load_base64_document_without_sidebar.html');
const EMPTY_DOCUMENT = path.resolve(__dirname, 'empty_document.html');

test('loads document from URL', async ({ page }) => {
  await page.goto(`file://${REMOTE_DOCUMENT}`);
  await testToolbar(page);
});

test('loads base64 encoded document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);
  await testToolbar(page);
});

test("sidebar is closed on small-screen devices by default", async ({ browser }) => {
  const page = await createMobileContext(browser)
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const sidebar = iframe.locator('#thumbnailView');
  await expect(sidebar).toBeHidden();
});

test("sidebar is closed when disabled", async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT_WITHOUT_SIDEBAR}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const sidebar = iframe.locator('#thumbnailView');
  await expect(sidebar).toBeHidden();
});

test('adds a typed signature to the document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  await waitForViewerReady(page);
  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: '' }));

  const signatureModal = iframe.getByRole('dialog');
  const signatureCanvas = signatureModal.getByRole('textbox', { name: 'Type your signature' });
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add' });
  const signatureAcceptButton = iframe.locator('.acceptButton');
  const signature = iframe.locator('.signatureEditor');
  const editorLayer = iframe.locator('.signatureEditing');

  await expect(signatureModal.getByText('Add a signature')).toBeVisible();
  await signatureCanvas.fill("Signature");

  await signatureAddButton.click();
  await expect(signature).toBeVisible();
  await expect(editorLayer).toBeVisible();

  await signatureAcceptButton.click();
  await expect(editorLayer).toBeHidden();
});

test('adds a drawn signature to the document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  await waitForViewerReady(page);
  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: '' }));

  const signatureModal = iframe.getByRole('dialog');
  const signatureCanvas = signatureModal.getByRole('img', { name: 'Draw your signature' });
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add', exact: true });
  const signatureAcceptButton = iframe.locator('.acceptButton');
  const signatureDrawTab = signatureModal.getByRole('tab', { name: 'Draw', exact: true });
  const signature = iframe.locator('.signatureEditor');
  const editorLayer = iframe.locator('.signatureEditing');

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
  await expect(editorLayer).toBeVisible();

  await signatureAcceptButton.click();
  await expect(editorLayer).toBeHidden();
});

test('adds an uploaded image signature to the document', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  await waitForViewerReady(page);
  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: '' }));

  const signatureModal = iframe.getByRole('dialog');
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add' });
  const signatureAcceptButton = iframe.locator('.acceptButton');
  const signatureImageTab = signatureModal.getByRole('tab', { name: 'Image', exact: true });
  const signatureUploadButton = iframe.getByText('Or browse image files');
  const signature = iframe.locator('.signatureEditor');
  const editorLayer = iframe.locator('.signatureEditing');

  await expect(signatureModal.getByText('Add a signature')).toBeVisible();
  await signatureImageTab.click();

  const uploadPromise = page.waitForEvent('filechooser');
  await signatureUploadButton.click();
  const fileChooser = await uploadPromise;
  await fileChooser.setFiles(path.join(__dirname, 'logo.gif'));

  await signatureAddButton.click();
  await expect(signature).toBeVisible();
  await expect(editorLayer).toBeVisible();

  await signatureAcceptButton.click();
  await expect(editorLayer).toBeHidden();
});

test('removes the signature', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframeElement = page.locator(`#${IFRAME_ID}`);
  const iframe = await iframeElement.contentFrame();

  await waitForViewerReady(page);
  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: '' }));

  const signatureModal = iframe.getByRole('dialog');
  const signatureCanvas = signatureModal.getByRole('textbox', { name: 'Type your signature' });
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add' });
  const signatureRemoveButton = iframe.locator('.deleteButton');
  const signature = iframe.locator('.signatureEditor');
  const editorLayer = iframe.locator('.signatureEditing');

  await expect(signatureModal.getByText('Add a signature')).toBeVisible();
  await signatureCanvas.fill("Signature");

  await signatureAddButton.click();
  await expect(signature).toBeVisible();
  await expect(editorLayer).toBeVisible();

  await signatureRemoveButton.click();
  await expect(signature).toBeHidden();
  await expect(editorLayer).toBeHidden();
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

test('selects text in the document', async ({ page }) => {
  await page.goto(`file://${EMPTY_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const textToSelect = iframe.getByText('Drag & drop your PDF here or click upload', { exact: true });

  const textBox = await textToSelect.boundingBox();

  if (!textBox) {
    throw new Error('The text is not selectable.');
  }

  await page.mouse.move(textBox.x + 2, textBox.y + 2);
  await page.mouse.down();
  await page.mouse.move(textBox.x + textBox.width - 2, textBox.y + 2);
  await page.mouse.up();
});

test('mobile view draws a continuous signature', async ({ browser, browserName }) => {
  test.skip(browserName === 'firefox');

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  const page = await context.newPage();
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  await waitForViewerReady(page);
  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: '' }));

  const signatureModal = iframe.getByRole('dialog');
  const signatureDrawTab = signatureModal.getByRole('tab', { name: 'Draw', exact: true });
  const signatureCanvas = signatureModal.getByRole('img', { name: 'Draw your signature' });
  const signatureAddButton = signatureModal.getByRole('button', { name: 'Add', exact: true });
  const signatureAcceptButton = iframe.locator('.acceptButton');
  const signature = iframe.locator('.signatureEditor');
  const editorLayer = iframe.locator('.signatureEditing');
  const drawPath = iframe.locator('#addSignatureDraw path');

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
  await page.mouse.move(endX, endY, { steps: 12 });
  await page.mouse.up();

  // A path was actually drawn (continuous stroke, not just a starting M).
  const drawnPath = await drawPath.getAttribute('d');
  expect(drawnPath).toBeTruthy();
  expect(drawnPath?.length ?? 0).toBeGreaterThan('M0 0'.length);

  await signatureAddButton.click();
  await expect(signature).toBeVisible();
  await expect(editorLayer).toBeVisible();

  await signatureAcceptButton.click();
  await expect(editorLayer).toBeHidden();
});

test('startSignatureFlow opens the dialog with the prefilled name', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const signatureModal = iframe.getByRole('dialog');
  const signatureCanvas = signatureModal.getByRole('textbox', { name: 'Type your signature' });

  // Wait until the viewer is fully initialised before invoking the API.
  await waitForViewerReady(page);

  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: 'Jane Doe' }));

  await expect(signatureModal).toBeVisible();
  await expect(signatureCanvas).toHaveValue('Jane Doe');
});

test('cancelSignatureFlow closes the dialog and removes the placeholder editor', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const signatureModal = iframe.getByRole('dialog');
  const editorLayer = iframe.locator('.signatureEditing');

  await waitForViewerReady(page);

  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: 'Jane Doe' }));
  await expect(signatureModal).toBeVisible();

  await page.evaluate(() => (window as any).viewer.cancelSignatureFlow());

  await expect(signatureModal).toBeHidden();
  await expect(editorLayer).toBeHidden();
});

test('startSignatureFlow can be re-invoked after cancelSignatureFlow', async ({ page }) => {
  await page.goto(`file://${BASE64_DOCUMENT}`);

  const iframe = page.locator(`#${IFRAME_ID}`).contentFrame();
  const signatureModal = iframe.getByRole('dialog');
  const signatureCanvas = signatureModal.getByRole('textbox', { name: 'Type your signature' });

  await waitForViewerReady(page);

  // First cycle.
  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: 'First' }));
  await expect(signatureModal).toBeVisible();
  await expect(signatureCanvas).toHaveValue('First');

  await page.evaluate(() => (window as any).viewer.cancelSignatureFlow());
  await expect(signatureModal).toBeHidden();

  // Give the deferred dialog "close" event and any pending updateMode
  // microtasks time to flush before the second cycle.
  await page.waitForTimeout(100);

  // Second cycle — guard against the updateMode capability race.
  await page.evaluate(() => (window as any).viewer.startSignatureFlow({ name: 'Second' }));
  await expect(signatureModal).toBeVisible();
  await expect(signatureCanvas).toHaveValue('Second');
});

const waitForViewerReady = async (page: Page) => {
  await page.waitForFunction(() => {
    const iframe = document.querySelector('iframe');

    if (!(iframe?.contentWindow as any)?.PDFViewerApplication) {
      return false;
    }

    const button = iframe?.contentDocument?.getElementById('signature') as HTMLButtonElement;

    return Boolean(button) && !button.disabled;
  });
};

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

const createMobileContext = async (browser: Browser) => {
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    viewport: { width: 390, height: 844 },
  });

  return await context.newPage();
}

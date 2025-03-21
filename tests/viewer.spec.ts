import * as path from 'node:path';
import { test, expect, Page } from '@playwright/test';

test('loads document from URL', async ({ page }) => {
  const htmlFilePath = path.resolve(__dirname, 'load_remote_document.html');
  await page.goto(`file://${htmlFilePath}`);
  await testViewer(page);
});

test('loads base64 encoded document', async ({ page }) => {
  const htmlFilePath = path.resolve(__dirname, 'load_base64_document.html');
  await page.goto(`file://${htmlFilePath}`);
  await testViewer(page);
});

const testViewer = async (page: Page) => {
  const iframe = page.locator('#id-iframe').contentFrame();
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

  // Assert sidebar is hidden
  await sidebarButton.click();
  await expect(sidebar).toBeHidden();

  // Assert findbar is shown
  await findbarButton.click();
  await expect(findbar).toBeVisible();
};

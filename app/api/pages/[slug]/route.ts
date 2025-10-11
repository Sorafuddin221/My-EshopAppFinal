
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

function getFilePath(slug: string) {
  return path.join(DATA_DIR, `${slug}.json`);
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = getFilePath(slug);

  console.log(`[API] GET request for slug: ${slug}`);
  console.log(`[API] Checking file path: ${filePath}`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log(`[API] File found for ${slug}. Returning content.`);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[API] Error reading file for ${slug}:`, error);
    // Return default content if file not found or error
    let defaultContent = '';
    if (slug === 'terms') {
      defaultContent = '<h2>Terms of Service</h2><p>These are our terms and conditions.</p>';
    } else if (slug === 'privacy-policy') {
      defaultContent = '<h2>Privacy Policy</h2><p>This is our privacy policy.</p>';
    } else if (slug === 'disclosure') {
      defaultContent = '<h2>Disclosure</h2><p>This is our disclosure statement.</p>';
    }
    console.log(`[API] File not found or error for ${slug}. Returning default content.`);
    return NextResponse.json({ content: defaultContent });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = getFilePath(slug);
  const { content } = await request.json();

  try {
    fs.writeFileSync(filePath, JSON.stringify({ content }), 'utf-8');
    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (error: unknown) {
    let errorMessage = 'Failed to update content';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(error);
    return NextResponse.json({ message: 'Failed to update content', error: errorMessage }, { status: 500 });
  }
}

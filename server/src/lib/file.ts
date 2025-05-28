import { readFile, writeFile, mkdir, access } from 'fs/promises';

export async function checkIfDirExist(path: string) {
  try {
    await access(path);
  } catch (error) {
    await mkdir(path);
  }
}

export async function readData(path: string) {
  try {
    const content = await readFile(path, { encoding: 'utf8' });
    return content;
  } catch (error) {
    console.error(
      "An error occured when trying read data from file. If file doesn't exist it'll be created."
    );
  }
}

export async function writeData(path: string, data: string) {
  try {
    await writeFile(path, JSON.stringify(data));
  } catch (error) {
    console.error('An error occured when trying save data to file.');
  }
}

async function generateHash(input, length) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input + length.toString()); 
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUniqueCharacter(charSet, hexChar, usedChars) {
    let index = parseInt(hexChar, 16);
    let uniqueChar = charSet[index % charSet.length];
    let tries = 0;

    while (usedChars.includes(uniqueChar)) {
        index++;
        uniqueChar = charSet[index % charSet.length];
        if (++tries > charSet.length) break; 
    }
    return uniqueChar;
}

function enhancePassword(hash, length) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allChars = upper + lower + numbers + special;
    let password = '';
    let usedChars = '';

    for (let i = 0; i < length; i++) {
        const hexIndex = i % (hash.length / 2);
        const hexChar = hash.substring(2 * hexIndex, 2 * hexIndex + 2);
        let charSet = allChars;
        if (i === 0) {
            charSet = upper + lower;
        }
        const char = getUniqueCharacter(charSet, hexChar, usedChars);
        password += char;
        usedChars += char;
    }
    return password;
}

async function generatePassword() {
    const siteTag = document.getElementById('site-tag').value;
    const masterKey = document.getElementById('master-key').value;
    const passwordLength = parseInt(document.getElementById('password-length').value);
    const baseInput = siteTag + masterKey;

    let hash = await generateHash(baseInput, passwordLength);
    const password = enhancePassword(hash, passwordLength);

    document.getElementById('generated-password').textContent = password;
}

document.getElementById('generateButton').addEventListener('click', generatePassword);
document.getElementById('password-length').addEventListener('input', function() {
    document.getElementById('length-display').textContent = this.value;
});

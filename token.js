require('dotenv').config();
const solanaWeb3 = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const bs58 = require('bs58');

// Load the base58-encoded private key from the environment variable
const base58PrivateKey = process.env['apikeytoken'];

if (!base58PrivateKey) {
    throw new Error('Private key not found in environment variables');
}

// Decode the base58-encoded private key
const walletPrivateKey = bs58.decode(base58PrivateKey);

if (walletPrivateKey.length !== 64) {
    throw new Error('Invalid private key size. Expected 64 bytes.');
}

(async () => {
    // Connect to Solana Devnet
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

    // Create a Keypair from the private key
    const wallet = solanaWeb3.Keypair.fromSecretKey(walletPrivateKey);

    try {
        // Create the mint account
        const mint = await Token.createMint(
            connection,
            wallet,
            wallet.publicKey,
            null,
            9, // Decimals
            TOKEN_PROGRAM_ID
        );

        // Get the token's associated account address
        const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(wallet.publicKey);

        // Mint the total supply to the token account
        const totalSupply = BigInt(10 * 10**7) * BigInt(10**9); // 10 crore tokens with 9 decimal places
        await mint.mintTo(
            tokenAccount.address,
            wallet.publicKey,
            [],
            totalSupply
        );

        console.log(`Token created successfully. Mint Address: ${mint.publicKey.toBase58()}`);
    } catch (error) {
        console.error("Error creating token:", error);
    }
})();

apikeytoken=4BDwLdUDVYN3Vgqh6ejcoRkM7rnpMUkYcbvULzms7FpmRN2Xf2VyWhegpTsN4ekAKUVXsx1KrRXwuL59vBmMBBjT
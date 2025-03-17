# Solana Token Wrapping and Unwrapping

This project provides functionality to wrap and unwrap SOL (Solana's native token) using the Solana blockchain. The main operations are encapsulated in two asynchronous functions: `wrapSol` and `unwrapSol`. These functions interact with the Solana network to convert SOL to WSOL (Wrapped SOL) and vice versa.

## Prerequisites

- Node.js installed on your machine.
- A Solana wallet with some SOL for testing.
- A `.env` file containing your private key in base58 format.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/benjaminTan10/sol-wrap-upwrap-wsol.git 
   cd sol-wrap-upwrap-wsol
   ```

2. Install the required dependencies:
   ```bash
   npm install @solana/web3.js @solana/spl-token dotenv bs58
   ```

3. Create a `.env` file in the root directory of the project and add your private key:
   ```plaintext
   PRIVATE_KEY=<your_base58_encoded_private_key>
   ```

## Functions

### 1. `wrapSol(wallet: any, amount: number)`

This function wraps a specified amount of SOL into WSOL. 

#### Parameters:
- `wallet`: The wallet object containing the public and private keys.
- `amount`: The amount of SOL to wrap.

#### Process:
- Checks if the wallet is connected.
- Creates an associated token account if it doesn't exist.
- Constructs a transaction to transfer SOL to the associated token account and sync the native token.
- Signs and sends the transaction to the Solana network.
- Logs the transaction confirmation and success message.

### 2. `unwrapSol(wallet: any, amount: number)`

This function unwraps WSOL back into SOL.

#### Parameters:
- `wallet`: The wallet object containing the public and private keys.
- `amount`: The amount of WSOL to unwrap.

#### Process:
- Checks if the wallet is connected.
- Retrieves the associated token account for WSOL.
- Creates a transaction to close the associated token account and send SOL back to the wallet.
- Signs and sends the transaction to the Solana network.
- Logs the transaction confirmation and success message.

### Error Handling

Both functions include error handling to catch and log any issues that arise during the transaction process. If the wallet is not connected or if there are issues with the transaction, appropriate error messages will be displayed.

## Conclusion

This project provides a straightforward way to manage SOL and WSOL on the Solana blockchain. By using the provided functions, users can easily wrap and unwrap their tokens as needed.

## Usage

To use the functions, you can uncomment the desired operation in the main execution block at the bottom of the `file.ts`:

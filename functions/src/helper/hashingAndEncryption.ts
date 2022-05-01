import { ENV } from './firebase'
import argon2 from 'argon2'
import aes from 'crypto-js/aes'
import CryptoJS from 'crypto-js'

export const hashMasterPassword = (masterPassword: string) =>
	argon2.hash(masterPassword, {
		secret: Buffer.from(ENV.argon2_pepper, 'utf-8'), // optional, pepper to encrypt hash
	})

export const verifyMasterPasswordHash = (hash: string, plain: string) =>
	argon2.verify(hash, plain, {
		secret: Buffer.from(ENV.argon2_pepper, 'utf-8'),
	})

export const decryptPasswords = (cipherText: string, key: string) =>
	aes.decrypt(cipherText, key).toString(CryptoJS.enc.Utf8) // aes output is different every time with same input, it doesn't need any extra secret key.

export const encryptPasswords = (plain: string, key: string) =>
	aes.encrypt(plain, key).toString()

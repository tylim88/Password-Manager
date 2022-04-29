import argon2 from 'argon2'
import aes from 'crypto-js/aes'
import CryptoJS from 'crypto-js'

export const hashMasterPassword = (masterPassword: string) =>
	argon2.hash(masterPassword)

export const verifyMasterPasswordHash = (hash: string, plain: string) =>
	argon2.verify(hash, plain)

export const decryptPasswords = (cipherText: string, key: string) =>
	aes
		.decrypt(cipherText, key) // secret is optional
		.toString(CryptoJS.enc.Utf8)

export const encryptPasswords = (plain: string, key: string) =>
	aes.encrypt(plain, key).toString()

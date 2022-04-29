import aes from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import bcrypt from 'bcryptjs'

export const hashMasterPassword = (masterPassword: string) =>
	bcrypt.hash(masterPassword, bcrypt.genSaltSync(10))

export const verifyMasterPasswordHash = ({
	hash,
	masterPassword,
}: {
	hash: string
	masterPassword: string
}) => bcrypt.compare(masterPassword, hash)

export const decryptPasswords = (cipherText: string, key: string) =>
	aes
		.decrypt(cipherText, key) // secret is optional
		.toString(CryptoJS.enc.Utf8)

export const encryptPasswords = (plain: string, key: string) =>
	aes.encrypt(plain, key).toString()

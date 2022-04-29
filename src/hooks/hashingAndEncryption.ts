import argon2 from 'argon2-browser'
import aes from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import { v4 } from 'uuid'

export const hashMasterPassword = (masterPassword: string) =>
	argon2.hash({ pass: masterPassword, salt: v4() }).then(h => h.encoded)

export const verifyMasterPasswordHash = ({
	hash,
	masterPassword,
}: {
	hash: string
	masterPassword: string
}) =>
	argon2
		.verify({ encoded: hash, pass: masterPassword })
		.then(() => true)
		.catch(e => {
			console.log(e)
			return false
		})

export const decryptPasswords = (cipherText: string, key: string) =>
	aes
		.decrypt(cipherText, key) // secret is optional
		.toString(CryptoJS.enc.Utf8)

export const encryptPasswords = (plain: string, key: string) =>
	aes.encrypt(plain, key).toString()

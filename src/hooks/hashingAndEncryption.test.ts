import {
	verifyMasterPasswordHash,
	hashMasterPassword,
	decryptPasswords,
	encryptPasswords,
} from './hashingAndEncryption'

describe('test hash and encryption', () => {
	test('hashing', async () => {
		const masterPassword = 'nzye72318eo732ez73e'
		const hash = await hashMasterPassword(masterPassword)

		const isValid = await verifyMasterPasswordHash({ hash, masterPassword })

		expect(isValid).toBe(true)
	})

	test('encryption', async () => {
		const text = 'nzye72318eo732ez73e'
		const masterPassword = '323726372163172'
		const cipherText = await encryptPasswords(text, masterPassword)

		const isText = await decryptPasswords(cipherText, masterPassword)

		expect(isText).toBe(text)
	})
})

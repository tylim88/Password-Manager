type OmitKeys<T, K extends keyof T> = Omit<T, K>

type ExcludeUnion<T, U extends T> = Exclude<T, U>

type NonNullableKey<T, K extends keyof T> = OmitKeys<T, K> &
	Required<{
		[index in K]: T[K]
	}>

type ENV = { env: { argon2_pepper: string; aes_secret: string } }

type Secret = { username: string; site: string; password: string }

type Passwords = { encryptedPasswords: string; masterPasswordHash: string }

type User = {
	hasMasterPassword: true
}

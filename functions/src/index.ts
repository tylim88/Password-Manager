import 'regenerator-runtime/runtime' // https://stackoverflow.com/a/51650116/5338829

import * as api from 'api'
import { allSchema } from 'schema'

// make sure all function names are correct
allSchema.forEach(schema => {
	const name = schema.name.value

	// typescript type checking able to find out the wrong function name
	exports[name] = api[name] // type error if function name is incorrect
})

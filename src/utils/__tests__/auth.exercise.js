// Testing Pure Functions

// 💣 remove this todo test (it's only here so you don't get an error about missing tests)
// 🐨 import the function that we're testing
// 💰 import {isPasswordAllowed} from '../auth'
import cases from 'jest-in-case'
import { isPasswordAllowed } from '../auth'

// 🐨 write tests for valid and invalid passwords
// 💰 here are some you can use:
//

function casify(obj) {
  return Object.entries(obj).map(([name, password]) => {
    return {
      name: `${password} - ${name}`,
      password
    }
  })
}

cases(
  'isPasswordAllowed valid passwords',
  (options) => {
    expect(isPasswordAllowed(options.password)).toBe(true)
  },
  casify({
    'valid password': '!aBc123'
  })
)

cases(
  'isPasswordAllowed invalid passwords',
  (options) => {
    expect(isPasswordAllowed(options.password)).toBe(false)
  },
  casify({
    'too short': 'a2c!',
    'no letters': '123456!',
    'no numbers': 'ABCdef!',
    'no uppercase letters': 'abc123!',
    'no lowercase letters': 'ABC123!',
    'non alphanumeric characters': 'ABCdef123'
  })
)


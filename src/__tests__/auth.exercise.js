// Testing Authentication API Routes

// 🐨 import the things you'll need
// 💰 here, I'll just give them to you. You're welcome
import axios from 'axios'
import { resetDb } from 'utils/db-utils'
import * as generate from 'utils/generate'
import { handleRequestFailure, getData, resolve } from 'utils/async'
import * as usersDB from '../db/users'
import startServer from '../start'

let api, server

beforeAll(async () => {
  server = await startServer({ port: 8000 })
  const baseURL = `http://localhost:${server.address().port}/api`
  api = axios.create({ baseURL })
  api.interceptors.response.use(getData, handleRequestFailure)
})

afterAll(() => server.close())
beforeEach(() => resetDb())

test('auth flow', async () => {
  const { username, password } = generate.loginForm()
  const registerResponse = await api.post('auth/register', {
    username,
    password,
  })

  expect(registerResponse.user).toEqual({
    token: expect.any(String),
    id: expect.any(String),
    username,
  })

  const loginResponse = await api.post('auth/login', {
    username,
    password,
  })

  expect(registerResponse.user).toEqual(loginResponse.user)

  const meResponse = await api.get('auth/me', {
    headers: {
      Authorization: `Bearer ${loginResponse.user.token}`,
    },
  })

  expect(loginResponse.user).toEqual(meResponse.user)
})

test('username must be unique', async () => {
  const { username, password } = generate.loginForm()
  await usersDB.insert(generate.buildUser({ username }))

  const error = await api
    .post('auth/register', {
      username,
      password,
    })
    .catch(resolve)

  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username taken"}]`,
  )
})

test('get me unauthenticated returns error', async () => {
  const error = await api.get('auth/me').catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 401: {"code":"credentials_required","message":"No authorization token was found"}]`,
  )
})

test('username required to register', async () => {
  const error = await api
    .post('auth/register', { password: generate.password })
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username can't be blank"}]`,
  )
})

test('password required to register', async () => {
  const error = await api
    .post('auth/register', { username: generate.username })
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username can't be blank"}]`,
  )
})

test('username required to login', async () => {
  const error = await api
    .post('auth/login', { password: generate.password })
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username can't be blank"}]`,
  )
})

test('password required to login', async () => {
  const error = await api
    .post('auth/login', { username: generate.username })
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username can't be blank"}]`,
  )
})

test('user must exist to login', async () => {
  const error = await api
    .post('auth/login', generate.loginForm({ username: 'this_papu_not_exist' }))
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username or password is invalid"}]`,
  )
})

// Testing Middleware

import { buildRes, buildReq, buildNext } from 'utils/generate'
import { UnauthorizedError } from 'express-jwt'
import errorMiddleware from '../error-middleware'

// 🐨 Write a test for the UnauthorizedError case
test('response with 401 for express-jwt Unauthorized Error', () => {
  const req = buildReq()
  const next = buildNext()
  const code = 'some_error_code'
  const message = 'Some message'
  const error = new UnauthorizedError(code, { message })
  const res = buildRes()
  errorMiddleware(error, req, res, next)
  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(401)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    code: error.code,
    message: error.message
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})


// 🐨 Write a test for the headersSent case
test('response headersSent Error', () => {
  const req = buildReq()
  const next = buildNext()
  const error = new Error('blah')
  const res = buildRes({ headersSent: true })
  errorMiddleware(error, req, res, next)
  expect(next).toHaveBeenCalledWith(error)
  expect(res.status).not.toHaveBeenCalled()
  expect(res.json).not.toHaveBeenCalled()
})

// 🐨 Write a test for the else case (responds with a 500)
test('response with 500 for express-jwt Error', () => {
  const req = buildReq()
  const next = buildNext()
  const error = new Error('blah')
  const res = buildRes()
  errorMiddleware(error, req, res, next)
  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(500)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    message: error.message,
    stack: error.stack
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})
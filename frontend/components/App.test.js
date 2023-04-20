// Write your tests here
import React from "react"
import AppClass from "./AppClass"
import { render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

test('sanity', () => {
  expect(true).toBe(true)
})

test('header text is visible', () => {
  render(<AppClass />)
  
  const coordinates = screen.queryByText(/coordinates/i)
  const steps = screen.queryByText(/you moved/i)

  expect(coordinates).toBeInTheDocument()
  expect(steps).toBeInTheDocument()
})

test('displays direction buttons', () => {
  render(<AppClass />)

  const leftBtn = screen.queryByText('LEFT')
  const rightBtn = screen.queryByText('RIGHT')
  const upBtn = screen.queryByText('UP')
  const downBtn = screen.queryByText('DOWN')

  expect(leftBtn).toBeInTheDocument()
  expect(rightBtn).toBeInTheDocument()
  expect(upBtn).toBeInTheDocument()
  expect(downBtn).toBeInTheDocument()
})

test('moves are effected by direction button clicks ', () => {
  render(<AppClass />)

  const upBtn = screen.getByTestId('up')

  fireEvent.click(upBtn)
  expect(screen.getByText("You moved 1 time")).toBeInTheDocument()
})

test('can type in email input', () => {
  render(<AppClass />)

  const emailInput = screen.getByRole('textbox', {id:'email'})

  expect(emailInput).toBeInTheDocument()
  fireEvent.change(emailInput, { target: {value: 'testEmail@email.com'}})
  expect(emailInput).toHaveValue('testEmail@email.com')
})

test('clicking reset button resets state', () => {
  render(<AppClass />)

  const inputBox = screen.getByRole('textbox', {id:'email'})
  const reset = screen.getByTestId('reset')

  fireEvent.change(inputBox, { target: {value: 'testEmail@email.com'}})
  expect(inputBox)
    .toHaveValue('testEmail@email.com')
  fireEvent.click(reset)
  expect(inputBox)
    .toHaveValue('')
})


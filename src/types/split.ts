// One person's share of one expense. Derived from the expense; never stored.
export interface ExpenseShare {
  expenseId: string
  participantId: string
  amount: number // in PHP, exact to the centavo
}
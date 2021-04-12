cart = Input.cart

REJECT_CODES = ['TESTREJECTED']
REJECT_MESSAGE = "This discount code cannot be used for click & collect orders"

if cart.discount_code && REJECT_CODES.include?(cart.discount_code.code)
  cart.discount_code.reject({ message: REJECT_MESSAGE })
end

Output.cart = Input.cart

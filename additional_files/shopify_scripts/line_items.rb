cart = Input.cart

REJECT_CODES = ['TESTREJECTED']
REJECT_MESSAGE = "This discount code cannot be used for click & collect orders"

class Address
  attr_accessor :address1, :suburb
  def initialize(address1, suburb)
    @address1 = address1
    @suburb = suburb
  end
end

CLICK_AND_COLLECT_ADDRESSES = Array.new
CLICK_AND_COLLECT_ADDRESSES << Address.new('4 Millner Avenue', 'Horsley Park')
CLICK_AND_COLLECT_ADDRESSES << Address.new('634-726 Princes Hwy', 'Tempe')
CLICK_AND_COLLECT_ADDRESSES << Address.new('300 Parramatta Rd', 'Auburn')
CLICK_AND_COLLECT_ADDRESSES << Address.new('1464 Ferntree Gully Rd', 'Knoxfield')
CLICK_AND_COLLECT_ADDRESSES << Address.new('249 Middleborough Rd', 'Box Hill')
CLICK_AND_COLLECT_ADDRESSES << Address.new('405 Boundary Road, Moorabbin Airport', 'Moorabbin Airport')
CLICK_AND_COLLECT_ADDRESSES << Address.new('10/340 McDonalds Rd', 'South Morang')
CLICK_AND_COLLECT_ADDRESSES << Address.new('125 Johnston Street', 'Fitzroy')
CLICK_AND_COLLECT_ADDRESSES << Address.new('2 Wells Street', 'Frankston')
CLICK_AND_COLLECT_ADDRESSES << Address.new('Aird Street', 'Parramatta')
CLICK_AND_COLLECT_ADDRESSES << Address.new('29-31 High Street', 'Berwick')
CLICK_AND_COLLECT_ADDRESSES << Address.new('4/68 Barkly Street', 'Mornington')
CLICK_AND_COLLECT_ADDRESSES << Address.new('3 Australia Avenue', 'Sydney Olympic Park')
CLICK_AND_COLLECT_ADDRESSES << Address.new('535 Pittwater Rd', 'Brookvale')

puts Input.cart.shipping_address.inspect

# Function flagging order as Click & Collect
def pickup_order?
  @pickup_order ||= CLICK_AND_COLLECT_ADDRESSES.any? {
    |a| a.address1 == Input.cart.shipping_address.address1 && a.suburb == Input.cart.shipping_address.city 
  }
end

if cart.discount_code && pickup_order? && REJECT_CODES.include?(cart.discount_code.code)
  cart.discount_code.reject({ message: REJECT_MESSAGE })
end

Output.cart = Input.cart

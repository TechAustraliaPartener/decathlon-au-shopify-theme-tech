# Manage No Payment Gateway + Afterpay and Zip Pay Limits
cart = Input.cart
@show_no_payment = false

puts Input.payment_gateways.map { |gateway| gateway.name }

@afterpay_threshold = 100
@zip_pay_threshold = 100
@show_afterpay = cart.subtotal_price >= Money.new(cents: @afterpay_threshold * 100)
@show_zip_pay = cart.subtotal_price >= Money.new(cents: @zip_pay_threshold * 100)

puts @show_afterpay
puts @show_zip

if cart.customer
  if cart.customer.tags
    if cart.customer.tags.include?('No Payment')
      @show_no_payment = true
    end
  end
end

Input.payment_gateways.delete_if do |payment_gateway|
  (payment_gateway.name == 'No Payment' and !@show_no_payment) or (payment_gateway.name.include? 'Afterpay' and !@show_afterpay) or (payment_gateway.name.include? 'Zip' and !@show_zip_pay)
end

Output.payment_gateways = Input.payment_gateways


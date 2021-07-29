cart = Input.cart
shipping_rates = Input.shipping_rates

puts shipping_rates.map { |rate| rate.name }

shipping_rates.delete_if do |shipping_rate|
  
  rate_name_upcase = shipping_rate.name.upcase
  
  # Delete free and express shipping line if cart weight > 19kg
  if cart.total_weight > 19000
    rate_name_upcase == ("FREE STANDARD SHIPPING") or rate_name_upcase == ("EXPRESS SHIPPING")
  else
    if cart.subtotal_price > Money.new(cents: 7900)
      rate_name_upcase == ("STANDARD SHIPPING")
    else
      rate_name_upcase == ("FREE STANDARD SHIPPING")
    end
  end
end

puts shipping_rates.map { |rate| rate.name }

if shipping_rates.length == 1 && shipping_rates[0]
  shipping_rates.delete_if do |shipping_rate|
    shipping_rate.name.upcase.include? "PICKUP"
  end
end 

puts shipping_rates.map { |rate| rate.name }

Output.shipping_rates = shipping_rates




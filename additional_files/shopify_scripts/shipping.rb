# Remove All Rates Fallback + Free Shipping 5kg max + Hide Express for Bulky
puts Input.shipping_rates.map { |rate| rate.name }

Input.shipping_rates.delete_if do |shipping_rate|
  cart = Input.cart
  # puts cart.total_weight
  # puts cart.subtotal_price
  
  # Delete free and express shipping line if cart weight > 22kg
  if cart.total_weight > 5000
    shipping_rate.name.upcase == ("FREE STANDARD SHIPPING") or
    shipping_rate.name == ("Express Shipping")
  else 
    if cart.subtotal_price > Money.new(cents: 7999)
      shipping_rate.name.upcase == ("STANDARD SHIPPING")
    end
  end
end

puts Input.shipping_rates.map { |rate| rate.name }

if Input.shipping_rates.length == 1 && Input.shipping_rates[0]
  Input.shipping_rates.delete_if do |shipping_rate|
    shipping_rate.name.upcase.include? "PICKUP"
  end
end 

puts Input.shipping_rates.map { |rate| rate.name }

Output.shipping_rates = Input.shipping_rates

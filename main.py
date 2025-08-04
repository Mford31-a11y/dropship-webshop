from flask import Flask, request, jsonify
import stripe
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

stripe.api_key = 'sk_test_REPLACE_WITH_YOUR_SECRET_KEY'

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {'name': item['name']},
                        'unit_amount': int(item['price'] * 100),
                    },
                    'quantity': item['quantity'],
                } for item in data['items']
            ],
            mode='payment',
            success_url='https://example.com/success',
            cancel_url='https://example.com/cancel',
        )
        return jsonify({'id': session.id})
    except Exception as e:
        return jsonify(error=str(e)), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)

<?php

namespace App\Http\Requests\Platform;

use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StorePharmacyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperOwner() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'owner_name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',

                Rule::unique(Pharmacy::class, 'email'),
                Rule::unique(User::class, 'email'),
            ],

            'password' => [
                'required',
                'confirmed',
                Password::defaults(),
            ],

            'password_confirmation' => [
                'required',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'address' => [
                'nullable',
                'string',
                'max:500',
            ],

            'city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'logo' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:2048',
            ],

            /*
            |--------------------------------------------------------------------------
            | Account Status
            |--------------------------------------------------------------------------
            */

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'suspended',
                ]),
            ],

            /*
            |--------------------------------------------------------------------------
            | Subscription
            |--------------------------------------------------------------------------
            */

            'subscription_plan' => [
                'required',
                Rule::in([
                    'trial',
                    'basic',
                    'premium',
                ]),
            ],

            'subscription_status' => [
                'required',
                Rule::in([
                    'active',
                    'expired',
                    'suspended',
                ]),
            ],

            'subscription_expires_at' => [
                'nullable',
                'date',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' =>
                'Pharmacy name is required.',

            'owner_name.required' =>
                'Owner name is required.',

            'email.required' =>
                'Email address is required.',

            'email.email' =>
                'Please enter a valid email address.',

            'email.unique' =>
                'This email is already registered for a pharmacy or user account.',

            'password.required' =>
                'Password is required.',

            'password.confirmed' =>
                'Password confirmation does not match.',

            'password_confirmation.required' =>
                'Please confirm the password.',

            'status.required' =>
                'Please select a pharmacy status.',

            'status.in' =>
                'The selected pharmacy status is invalid.',

            'subscription_plan.required' =>
                'Please select a subscription plan.',

            'subscription_plan.in' =>
                'The selected subscription plan is invalid.',

            'subscription_status.required' =>
                'Please select a subscription status.',

            'subscription_status.in' =>
                'The selected subscription status is invalid.',

            'subscription_expires_at.date' =>
                'Please enter a valid subscription expiry date.',

            'logo.image' =>
                'The logo must be a valid image file.',

            'logo.mimes' =>
                'The logo must be a JPEG, JPG, PNG, or WEBP image.',

            'logo.max' =>
                'The logo may not be larger than 2 MB.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower(
                trim((string) $this->email)
            ),

            'country' =>
                $this->country ?: 'Saudi Arabia',

            /*
             * Existing create forms may not have the new
             * subscription inputs yet.
             */
            'subscription_plan' =>
                $this->input(
                    'subscription_plan',
                    'basic'
                ),

            'subscription_status' =>
                $this->input(
                    'subscription_status',
                    'active'
                ),

            /*
             * For a monthly Basic/Premium subscription,
             * default to one month when the form does not
             * provide an expiry date.
             */
            'subscription_expires_at' =>
                $this->input('subscription_expires_at')
                ?: now()->addMonth()->toDateString(),
        ]);
    }
}
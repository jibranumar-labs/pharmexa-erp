<?php

namespace App\Services\Traceability;

use App\Models\TraceabilitySetting;

class AuthenticationService
{
    /**
     * Check whether traceability is enabled.
     */
    public function isEnabled(TraceabilitySetting $settings): bool
    {
        return (bool) $settings->enabled;
    }

    /**
     * Check whether all required credentials exist.
     */
    public function hasCredentials(TraceabilitySetting $settings): bool
    {
        return
            !empty($settings->gln) &&
            !empty($settings->username) &&
            !empty($settings->password);
    }

    /**
     * Check whether a certificate has been configured.
     */
    public function hasCertificate(TraceabilitySetting $settings): bool
    {
        return !empty($settings->certificate_path);
    }

    /**
     * Validate the complete traceability configuration.
     */
    public function validate(TraceabilitySetting $settings): bool
    {
        return
            $this->isEnabled($settings) &&
            $this->hasCredentials($settings) &&
            $this->hasCertificate($settings);
    }

    /**
     * Build authentication payload.
     *
     * NOTE:
     * This array is an internal representation.
     * It will later be mapped to the official
     * Saudi RSD SOAP authentication format.
     */
    public function credentials(TraceabilitySetting $settings): array
    {
        return [
            'gln' => $settings->gln,
            'username' => $settings->username,
            'password' => $settings->password,
            'certificate' => $settings->certificate_path,
            'certificate_password' => $settings->certificate_password,
            'environment' => $settings->environment,
        ];
    }
}
<?php

namespace App\Services\Traceability;

use App\Models\TraceabilitySetting;

class CertificateService
{
    /**
     * Check whether a certificate has been configured.
     */
    public function isConfigured(
        TraceabilitySetting $settings
    ): bool {
        return !empty($settings->certificate_path);
    }

    /**
     * Get the absolute certificate path.
     */
    public function path(
        TraceabilitySetting $settings
    ): ?string {

        if (!$this->isConfigured($settings)) {
            return null;
        }

        return storage_path(
            'app/' . $settings->certificate_path
        );
    }

    /**
     * Check whether the certificate file exists.
     */
    public function exists(
        TraceabilitySetting $settings
    ): bool {

        $path = $this->path($settings);

        return $path !== null && file_exists($path);
    }

    /**
     * Get the certificate password.
     */
    public function password(
        TraceabilitySetting $settings
    ): ?string {

        return $settings->certificate_password;
    }

    /**
     * Validate certificate configuration.
     */
    public function validate(
        TraceabilitySetting $settings
    ): bool {

        return
            $this->isConfigured($settings) &&
            $this->exists($settings);
    }

    /**
     * Return certificate information.
     *
     * Useful for diagnostics and future dashboard widgets.
     */
    public function info(
        TraceabilitySetting $settings
    ): array {

        return [

            'configured' => $this->isConfigured($settings),

            'exists' => $this->exists($settings),

            'path' => $this->path($settings),

        ];
    }
}
<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperOwner = 'super_owner';
    case Owner = 'owner';
    case Admin = 'admin';
    case Pharmacist = 'pharmacist';
    case Cashier = 'cashier';

    public function label(): string
    {
        return match ($this) {
            self::SuperOwner => 'Super Owner',
            self::Owner => 'Owner',
            self::Admin => 'Admin',
            self::Pharmacist => 'Pharmacist',
            self::Cashier => 'Cashier',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
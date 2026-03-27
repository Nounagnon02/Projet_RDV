<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SiteSettingController extends Controller
{
    /**
     * Get all site settings (public)
     */
    public function index()
    {
        $settings = SiteSetting::getAll();
        return response()->json($settings);
    }

    /**
     * Get all settings with metadata (admin only)
     */
    public function adminIndex()
    {
        $settings = SiteSetting::all();
        return response()->json($settings);
    }

    /**
     * Update multiple settings at once
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($request->settings as $setting) {
            SiteSetting::set(
                $setting['key'],
                $setting['value'] ?? '',
                $setting['type'] ?? 'text'
            );
        }

        return response()->json([
            'message' => 'Paramètres mis à jour avec succès',
            'settings' => SiteSetting::getAll()
        ]);
    }

    /**
     * Update a single setting
     */
    public function updateSingle(Request $request, $key)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required',
            'type' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $setting = SiteSetting::set(
            $key,
            $request->value,
            $request->type ?? 'text'
        );

        return response()->json([
            'message' => 'Paramètre mis à jour',
            'setting' => $setting
        ]);
    }
}

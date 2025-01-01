"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BreadCalculator = () => {
    const [initialized, setInitialized] = useState(false);
    const [additionalFlour, setAdditionalFlour] = useState(1000);
    const [starter, setStarter] = useState(200);
    const [waterPercentage, setWaterPercentage] = useState(75);
    const [saltPercentage, setSaltPercentage] = useState(2);

    useEffect(() => {
        const savedFlour = localStorage.getItem('bread-flour');
        const savedStarter = localStorage.getItem('bread-starter');
        const savedWater = localStorage.getItem('bread-water');
        const savedSalt = localStorage.getItem('bread-salt');

        if (savedFlour) setAdditionalFlour(Number(savedFlour));
        if (savedStarter) setStarter(Number(savedStarter));
        if (savedWater) setWaterPercentage(Number(savedWater));
        if (savedSalt) setSaltPercentage(Number(savedSalt));
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (!initialized) return;

        localStorage.setItem('bread-flour', additionalFlour.toString());
        localStorage.setItem('bread-starter', starter.toString());
        localStorage.setItem('bread-water', waterPercentage.toString());
        localStorage.setItem('bread-salt', saltPercentage.toString());
    }, [initialized, additionalFlour, starter, waterPercentage, saltPercentage]);

    // Rest of the component remains the same
    const calculateIngredients = () => {
        const starterFlour = starter / 2;
        const starterWater = starter / 2;
        const totalFlour = additionalFlour + starterFlour;
        const desiredWater = (totalFlour * waterPercentage) / 100;
        const additionalWater = desiredWater - starterWater;
        const salt = (totalFlour * saltPercentage) / 100;

        return {
            additionalFlour: Math.round(additionalFlour),
            additionalWater: Math.round(additionalWater),
            salt: salt.toFixed(1)
        };
    };

    const results = calculateIngredients();

    return (
        <div className="space-y-8 w-full max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Calculateur de Pain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="flour">Farine (g)</Label>
                            <Input
                                id="flour"
                                type="number"
                                value={additionalFlour}
                                onChange={(e) => setAdditionalFlour(Number(e.target.value))}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="starter">Levain (g)</Label>
                            <Input
                                id="starter"
                                type="number"
                                value={starter}
                                onChange={(e) => setStarter(Number(e.target.value))}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="water">Pourcentage d&#39;eau (%)</Label>
                            <Input
                                id="water"
                                type="number"
                                value={waterPercentage}
                                onChange={(e) => setWaterPercentage(Number(e.target.value))}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salt">Pourcentage de sel (%)</Label>
                            <Input
                                id="salt"
                                type="number"
                                value={saltPercentage}
                                onChange={(e) => setSaltPercentage(Number(e.target.value))}
                                min="0"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ingrédients nécessaires</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Farine</p>
                            <p className="text-2xl">{results.additionalFlour}g</p>
                        </div>
                        <div>
                            <p className="font-medium">Eau</p>
                            <p className="text-2xl">{results.additionalWater}g</p>
                        </div>
                        <div>
                            <p className="font-medium">Sel</p>
                            <p className="text-2xl">{results.salt}g</p>
                        </div>
                        <div>
                            <p className="font-medium">Levain</p>
                            <p className="text-2xl">{starter}g</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BreadCalculator;
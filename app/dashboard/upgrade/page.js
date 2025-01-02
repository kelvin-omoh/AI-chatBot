'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../convex/_generated/api';

const plans = [
    { name: 'Free', price: '$0/month', features: ['Basic Features', '1 GB Storage'], tokenCount: 5 },
    { name: 'Starter', price: '$9/month', features: ['All Free Features', '10 GB Storage', 'Priority Support'], tokenCount: 15 },
    { name: 'Pro', price: '$19/month', features: ['All Starter Features', '100 GB Storage', 'Dedicated Support'], tokenCount: 30 },
];

const TokenManagementPage = () => {
    const { user } = useUser();
    const [selectedPlan, setSelectedPlan] = useState('');
    const [userTokens, setUserTokens] = useState(0);

    // Fetch user details including plan and tokens from the backend
    const userQuery = useQuery(api.User.getUserDetails, { email: user?.primaryEmailAddress?.emailAddress });


    const upgradeUserPlanMutation = useMutation(api.User.upgradeUserPlan);

    useEffect(() => {
        if (userQuery) {
            console.log(userQuery[0]);
            setSelectedPlan(userQuery[0]?.plan);
            setUserTokens(userQuery[0]?.tokens);
        }
    }, [userQuery]);

    const handleUpgrade = async (plan) => {
        try {
            console.log({ email: user?.primaryEmailAddress?.emailAddress, plan });

            await upgradeUserPlanMutation({ email: user?.primaryEmailAddress?.emailAddress, plan });
            alert(`Successfully upgraded to the ${plan} plan!`);
        } catch (error) {
            console.log();

            alert('Failed to upgrade plan');
        }
    };



    return (
        <div className='flex flex-col items-center p-10 bg-gradient-to-r from-black via-purple-800 to-black shadow-lg min-h-screen'>
            <h1 className='text-5xl font-bold text-white mb-10'>Manage Your Plan and Tokens</h1>

            {/* Display current plan and token count */}
            <div className='text-center text-white mb-8'>
                <h2 className='text-2xl font-semibold'>Your Current Plan: {selectedPlan || 'Loading...'}</h2>
                <h3 className='text-xl'>Tokens Remaining: {userTokens}</h3>
            </div>

            <div className='flex justify-between w-full max-w-7xl'>
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`bg-white rounded-lg shadow-lg p-8 text-center transition-transform transform hover:scale-105 ${plan.name === selectedPlan ? 'ring-2 ring-purple-600' : ''}`}
                    >
                        <h2 className='text-3xl font-semibold text-purple-600'>{plan.name}</h2>
                        <p className='text-2xl font-bold'>{plan.price}</p>
                        <ul className='my-6'>
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className='flex items-center justify-center mb-3'>{feature}</li>
                            ))}
                        </ul>
                        <button
                            className={`bg-purple-600 text-white py-3 px-5 rounded-lg hover:bg-purple-700 transition duration-300 ${plan.name === selectedPlan ? 'bg-purple-700' : ''}`}
                            onClick={() => handleUpgrade(plan.name)}
                        >
                            Select {plan.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TokenManagementPage;

/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');


//Standard class to instantiate for creating a smart contract
class CropInsuranceContract extends Contract {


    async instantiate(ctx) {
        console.info('instantiate');

        // Define participant       
        var emptyList = [];
        await ctx.stub.putState('farmers', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('insProviders', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('banks', Buffer.from(JSON.stringify(emptyList)));


    }


    // define participant function 
    async AddFarmer(ctx, farmerId, firstName, lastName, aadharId, clusterId, bankId, branchId, acctNo) {

        var farmer = {
            "farmerId": farmerId,
            "firstName": firstName,
            "lastName": lastName,
            "aadharId": aadharId,
            "clusterId": clusterId,
            "bankId": bankId,
            "branchId": branchId,
            "acctNo": acctNo

        }

        
        await ctx.stub.putState(farmerId, Buffer.from(JSON.stringify(farmer)));

        //add farmerId to 'farmer' key
        const data = await ctx.stub.getState('farmers');
        let farmers = JSON.parse(data.toString());        
        farmers.push(farmerId);
        await ctx.stub.putState('farmers', Buffer.from(JSON.stringify(farmers)));        

        return JSON.stringify(farmer);
    }

        // define participant function 
        async AddInsProvider(ctx, insProviderId, name, regNo) {

            var insProvider = {
                "insProviderId": insProviderId,
                "name": name,
                "regNo": regNo
            }
    
            
            await ctx.stub.putState(insProviderId, Buffer.from(JSON.stringify(insProvider)));
    
            //add farmerId to 'farmer' key
            const data = await ctx.stub.getState('insProviders');
            let insProviders = JSON.parse(data.toString());        
            insProviders.push(insProviderId);
            await ctx.stub.putState('insProviders', Buffer.from(JSON.stringify(insProviders)));        
    
            return JSON.stringify(insProvider);
        }

    // define creating the asset function 
    async SuubmitInsApplnReq(ctx, InsApplnId, insProviderId, farmerId, bankId, policyNo, sumAssured, premiumAmt, policyStatus) {

        // verify farmerId exists and retrieve it 
        let farmerData = await ctx.stub.getState(farmerId);
        let farmer;
        if (farmerData) {
            farmer = JSON.parse(farmerData.toString());
            if (farmer.farmerId !== farmerId) {
             throw new Error('farmer not identified');
           }
        } else {
            throw new Error('farmer not found');
        }

        let insuranceAppln = {
            "InsApplnId": InsApplnId,
            "insProviderId": insProviderId,
            "farmerId": farmerId,
            "bankId": bankId,
            "policyNo": policyNo,
            "sumAssured": sumAssured,
            "policyStatus": policyStatus,
            "premiumAmt": premiumAmt
        }

        
        await ctx.stub.putState(InsApplnId, Buffer.from(JSON.stringify(insuranceAppln)));
       

        return JSON.stringify(insuranceAppln);
    }

    // Check weatherData event and trigger claim process in case of Natural Disaster
    async triggerClaim(ctx, InsApplnId, farmerId) {


    }

    // Define performing a claim settlement in case of natural disaster
    // where a claim amt is directly distributed to farmer's acct
    async processClaim(ctx, InsApplnId, farmerId) {

        // verify id 
        let farmerData = await ctx.stub.getState(farmerId);
        if (!farmerData)  //{
            throw new Error('farmer not found');

        //update owner of Trade/Commodity
        const insApplnData = await ctx.stub.getState(InsApplnId);
        let insuranceAppln;
        if (commodityData) {
            insuranceAppln = JSON.parse(commodityData.toString());
            insuranceAppln.policyStatus = "CLAIM_IN_PROCESS";
        }
        else {
            throw new Error('insuranceAppln not found');
        }

        let farmer;
        if (farmerData) {
            farmer = JSON.parse(farmerData.toString());
            //tODO call bank gateway to credit farmer's account
        }
        else {
            throw new Error('insuranceAppln not found');
        }

        await ctx.stub.putState(InsApplnId, Buffer.from(JSON.stringify(insuranceAppln)));      

        return JSON.stringify(insuranceAppln);
        
    }

    // get the state from key
    async GetState(ctx, key) {

        const data = await ctx.stub.getState(key);
        let jsonData = JSON.parse(data.toString());
        return JSON.stringify(jsonData);
        
    }

}

module.exports = MyContract;

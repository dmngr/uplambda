"use strict";

const AWS = require('aws-sdk');

// name is the alias for the current version
module.exports = function (functionName, name, api_info, account, aws_config) {
  console.log("updateStageVariables");
  const apigateway = new AWS.APIGateway(aws_config);
  const apiId = api_info.apiId;
  const stageNames = api_info.stageNames;
  const promises = stageNames.map(stageName => apigateway.updateStage({
    restApiId: apiId,
    stageName: stageName,
    patchOperations: [{
      op: "replace",
      path: `/variables/${functionName}`,
      value: name
    }]
  }).promise());

  return Promise.all(promises)
    .then(() => {
      // console.log('res:', res);
      return Promise.resolve();
    })
    .catch(err => {
      console.log("err", err);
      return Promise.reject(err);
    });
};
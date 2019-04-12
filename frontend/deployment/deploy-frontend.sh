region="us-east-1"

stackName="route-watcher-frontend"
templateBody="file://static-website.yaml"
parameter="file://static-website.template-parameters.json"

if ! aws cloudformation describe-stacks --region $region --stack-name $stackName ; then
      echo -e "\nStack does not exist, creating ..."
      aws cloudformation create-stack --region $region --stack-name $stackName --template-body $templateBody --parameters $parameter --capabilities CAPABILITY_NAMED_IAM --region $region

      echo "Waiting for stack to be created ..."
      aws cloudformation wait stack-create-complete --region $region --stack-name $stackName
    else
      echo -e "\nStack exists, attempting update ..."
      set +e
      update_output=$( aws cloudformation update-stack --region $region --stack-name $stackName --template-body $templateBody --parameters $parameter --capabilities CAPABILITY_NAMED_IAM --region $region  2>&1)
      status=$?
      set -e
      echo "$update_output"

      if [ $status -ne 0 ] ; then
        # Don't fail for no-op update
        if [[ $update_output == *"ValidationError"* && $update_output == *"No updates"* ]] ; then
          echo -e "\nFinished create/update - no updates to be performed"
          exit 0
        else
          exit $status
        fi
      fi

      echo "Waiting for stack update to complete ..."
      aws cloudformation wait stack-update-complete --region $region --stack-name $stackName
    fi

aws 
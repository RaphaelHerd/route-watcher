bucketName="site.digital-cloud-test.de"

cd app
npm install
cd ..

aws s3 cp ./app s3://$bucketName --recursive
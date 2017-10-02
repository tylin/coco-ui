import boto3
import json
import xmltodict

# add your aws keys to
aws_key = json.load(open("keys.json"))
config = json.load(open("config.json"))
HIT = config["HIT"]

if HIT["USE_SANDBOX"]:
    endpoint_url = "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
else:
    endpoint_url = "https://mturk-requester.us-east-1.amazonaws.com"

# create mturk connection through boto3
mturk = boto3.client('mturk',
   aws_access_key_id = aws_key["aws_access_key_id"],
   aws_secret_access_key = aws_key["aws_secret_access_key"],
   region_name=HIT["REGION_NAME"],
   endpoint_url = endpoint_url
)

# hit_id = 'PASTE_IN_YOUR_HIT_ID'
hit_id = '338431Z1FLPM53G4LCNQFGPCSRNROC'
worker_results = mturk.list_assignments_for_hit(HITId=hit_id)
response = mturk.get_assignment(
    AssignmentId = worker_results['Assignments'][0]['AssignmentId']
)
xml_doc = xmltodict.parse(response['Assignment']['Answer'])
answer = json.loads(xml_doc['QuestionFormAnswers']['Answer']['FreeText'])
print(answer)
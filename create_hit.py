import boto3
import json
import os

def create_xml_question(html_text):
    return '<HTMLQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2011-11-11/HTMLQuestion.xsd"><HTMLContent><![CDATA[\n' + \
           html_text +\
           '\n]]></HTMLContent><FrameHeight>600</FrameHeight></HTMLQuestion>'

def replace_static_root(html_text, static_root):
    return html_text.replace("../static", static_root.encode("utf8"))

# static can only be used to indicate static root in html!
def replace_mturk_form_action(html_text, mturk_form_action):
    return html_text.replace("MTURK_FORM_ACTION", mturk_form_action)


if not os.path.exists("keys.json"):
    raise Exception('Please add your aws keys to create HIT on aws')

# TODO Ssyncing static files to gcp bucket


# add your aws keys to
aws_key = json.load(open("keys.json"))
config = json.load(open("config.json"))
HIT = config["HIT"]
if HIT["USE_SANDBOX"]:
    print("create HIT on sandbox")
    endpoint_url = "https://mturk-requester-sandbox.us-east-1.amazonaws.com"
    mturk_form_action = "https://workersandbox.mturk.com/mturk/externalSubmit"
    mturk_url = "https://workersandbox.mturk.com/"
else:
    print("create HIT on mturk")
    endpoint_url = "https://mturk-requester.us-east-1.amazonaws.com"
    mturk_form_action = "https://www.mturk.com/mturk/externalSubmit"
    mturk_url = "https://worker.mturk.com/"

# create mturk connection through boto3
mturk = boto3.client('mturk',
   aws_access_key_id = aws_key["aws_access_key_id"],
   aws_secret_access_key = aws_key["aws_secret_access_key"],
   region_name=HIT["REGION_NAME"],
   endpoint_url = endpoint_url
)

# create hit with config
html_text = open(HIT["Question"], "r").read()
html_text = replace_static_root(html_text, config["STATIC_ROOT"])
html_text = replace_mturk_form_action(html_text, mturk_form_action)
new_hit = mturk.create_hit(
    Title = HIT['Title'],
    Description = HIT["Description"],
    Keywords = HIT["Keywords"],
    Reward = HIT["Reward"],
    MaxAssignments = HIT["MaxAssignments"],
    LifetimeInSeconds = HIT["LifetimeInSeconds"],
    AssignmentDurationInSeconds = HIT["AssignmentDurationInSeconds"],
    AutoApprovalDelayInSeconds = HIT["AutoApprovalDelayInSeconds"],
    Question = create_xml_question(html_text),
)
print("HITId: " + new_hit['HIT']['HITId'])
print("A new HIT has been created. You can preview it here:")
print(mturk_url + "mturk/preview?groupId=" + new_hit['HIT']['HITGroupId'])
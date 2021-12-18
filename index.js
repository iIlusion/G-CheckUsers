import { Extension, HDirection, HPacket } from 'gnode-api';
import fs from 'fs';
let state;
let i = 0;

const extensionInfo = {
  name: 'OGUser Checker',
  description: 'Check OG Users.',
  version: '1.0',
  author: 'Lxx'
};

const ext = new Extension(extensionInfo);

ext.run();

const results = {
  0: 'Free',
  2: 'Short Name',
  3: 'Long Name',
  4: 'Invalid Name',
  5: 'Name Exists'
};

const verifiedUsers = [];

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'CheckUserNameResult', async hMessage => {
  const hPacket = hMessage.getPacket()
  let vars = hPacket.read('iS')
  let result = vars[0]
  let user = vars[1]

  i++

  console.log(`${i} - Tested: ${user} Result: ${results[result]}`)
  verifiedUsers.push({ user, result: results[result] });
})

ext.on('click', async () => {
  if (!state) {
    state = true;
    verifyNewEntries();
    const entries = get();
    const checkingUsers = await Promise.all(
      entries.map(
        async (u, i) =>
          new Promise((resolve) => {
            setTimeout(() => {
              if (u.checked) return;
              let userCheck = new HPacket(`{out:CheckUserName}{s:"${u.user}"}`);
              ext.sendToServer(userCheck);

              const hasVerifiedUser = () => {
                const finded = verifiedUsers.find((d) => d.user == u.user);
                if (finded) {
                  u.checked = true;
                  let freeTxt = fs.readFileSync(`${process.cwd()}/free.txt`, 'utf-8')
                  if (finded.result == 'Free') freeTxt += `\n${u.user}`
                  fs.writeFileSync(`${process.cwd()}/free.txt`, freeTxt, 'utf-8');
                  resolve(u);
                } else {
                  setTimeout(hasVerifiedUser, i);
                }
              };
              hasVerifiedUser();
            }, i * 600);
          })
      )
    );
    set(checkingUsers);
  } else state = false;
});

async function verifyNewEntries() {
  const add = fs.readFileSync(`${process.cwd()}/add.txt`, 'utf-8');
  if (!add) return;
  const addEntries = add.split('\r\n');
  const users = get();

  addEntries.map((u) => {
    if (users.find((e) => e.user === u)) return;
    users.push({ user: u, checked: false });
  });

  set(users);
  fs.writeFileSync(`${process.cwd()}/add.txt`, '', 'utf-8');

  console.log(`added ${addEntries.length} users to database`);
}

function get() {
  const users = fs.readFileSync(`${process.cwd()}/users.json`, 'utf-8');
  return JSON.parse(users);
}

function set(array) {
  if (!array) array = [];
  fs.writeFileSync(
    `${process.cwd()}/users.json`,
    JSON.stringify(array),
    'utf-8'
  );
}
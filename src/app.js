let web3, contract, account, profile
let activeChat

const UPCHAT = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"address","name":"friend","type":"address"}],"name":"Friend","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"Message","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"}],"name":"Request","type":"event"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"revokeRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"}],"name":"RevokeRequest","type":"event"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"string","name":"message","type":"string"}],"name":"sendMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"sendRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"friend","type":"address"}],"name":"unFriend","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"address","name":"friend","type":"address"}],"name":"Unfriend","type":"event"}]
const UNIVERSALPROFILES = [{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"operation","type":"uint256"},{"indexed":true,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"}],"name":"ContractCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"dataKey","type":"bytes32"}],"name":"DataChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"operation","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes4","name":"selector","type":"bytes4"}],"name":"Executed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"typeId","type":"bytes32"},{"indexed":true,"internalType":"bytes","name":"returnedValue","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"receivedData","type":"bytes"}],"name":"UniversalReceiver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"}],"name":"ValueReceived","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"claimOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"operation","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bytes","name":"result","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"dataKeys","type":"bytes32[]"}],"name":"getData","outputs":[{"internalType":"bytes[]","name":"dataValues","type":"bytes[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataKey","type":"bytes32"}],"name":"getData","outputs":[{"internalType":"bytes","name":"dataValue","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"internalType":"bytes4","name":"magicValue","type":"bytes4"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"dataKeys","type":"bytes32[]"},{"internalType":"bytes[]","name":"dataValues","type":"bytes[]"}],"name":"setData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataKey","type":"bytes32"},{"internalType":"bytes","name":"dataValue","type":"bytes"}],"name":"setData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"typeId","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"universalReceiver","outputs":[{"internalType":"bytes","name":"returnValue","type":"bytes"}],"stateMutability":"payable","type":"function"}]

const main = async () => {
  if (window.ethereum) {
    await ethereum.request({ method: "eth_requestAccounts" })

    document.getElementById('loadingStatus').innerHTML = 'Connecting to contract...'

    web3 = new Web3(window.ethereum)
    contract = new web3.eth.Contract(UPCHAT, "0x8d5285E8c481E4bd93A2Cb2701523fd1F3A4E504")
    account = (await ethereum.request({ method: "eth_accounts" }))[0]
    profile = new web3.eth.Contract(UNIVERSALPROFILES, account)

    await initMenus()
    await initRequests()
    await initFriends()

    document.getElementById("loader").classList = "pageloader is-black"
    document.getElementById('loadingStatus').innerHTML = ''
  } else {
    document.getElementById('loadingStatus').innerHTML = 'Web3 extension not found!'
  }
}

const initMenus = async () => {
  document.getElementById('openRequestModal').onclick = () => {
    document.getElementById('requestModal').classList = "modal is-active"
  }

  document.getElementById('closeRequestModal').onclick = () => {
    document.getElementById('requestModal').classList = "modal"
  }

  document.getElementById('openActiveChats').onclick = () => {
    document.getElementById('openActiveChats').classList = "is-active"
    document.getElementById('openClosedChats').classList = ""
    document.getElementById('activeChats').style.display = ""
    document.getElementById('closedChats').style.display = "none"
    document.getElementById('messages').innerHTML = ""
    document.getElementById('chatBox').style.display = "none"
  }

  document.getElementById('openClosedChats').onclick = () => {
    document.getElementById('openActiveChats').classList = ""
    document.getElementById('openClosedChats').classList = "is-active"
    document.getElementById('activeChats').style.display = "none"
    document.getElementById('closedChats').style.display = ""
    document.getElementById('messages').innerHTML = ""
    document.getElementById('chatBox').style.display = "none"
  }
}

const initRequests = async () => {
  document.getElementById('sendRequestBtn').onclick = async () => {
    if (document.getElementById('sendRequestBtn').disabled) return

    document.getElementById('sendRequestBtn').disabled = true
    document.getElementById('sendRequestAddr').disabled = true

    await contract.methods.sendRequest(document.getElementById('sendRequestAddr').value).send({
      from: account
    }).catch(err => {
      bulmaToast.toast({
        message: "Something wrong happened, please check console!",
        type: `is-danger`,
        dismissible: false,
        position: "bottom-center",
        animate: { in: 'fadeIn', out: 'fadeOut' },
      })
      
      document.getElementById('sendRequestBtn').disabled = false
      document.getElementById('sendRequestAddr').disabled = false

      return console.log(err)
    })

    document.getElementById('sendRequestBtn').disabled = false
    document.getElementById('sendRequestAddr').disabled = false
    document.getElementById('sendRequestAddr').value = ""

    bulmaToast.toast({
      message: "Sent friend request successfully!",
      type: `is-success`,
      dismissible: false,
      position: "bottom-center",
      animate: { in: 'fadeIn', out: 'fadeOut' },
    })
  }
}

const initFriends = async () => {
  let friendCount = {}

  const events1 = await contract.getPastEvents('Friend', {
    filter: { executor: account },
    fromBlock: 0,
    toBlock: 'latest'
  })

  events1.forEach(event => {
    if (typeof friendCount[event.returnValues["friend"]] === 'undefined') {
      friendCount[event.returnValues["friend"]] = 1
    } else {
      friendCount[event.returnValues["friend"]] += 1
    }  
  })

  const events2 = await contract.getPastEvents('Friend', {
    filter: { friend: account },
    fromBlock: 0,
    toBlock: 'latest'
  })

  events2.forEach(event => {
    if (typeof friendCount[event.returnValues["executor"]] === 'undefined') {
      friendCount[event.returnValues["executor"]] = 1
    } else {
      friendCount[event.returnValues["executor"]] += 1
    }  
  })

  const events3 = await contract.getPastEvents('Unfriend', {
    filter: { executor: account },
    fromBlock: 0,
    toBlock: 'latest'
  })

  events3.forEach(event => {
    friendCount[event.returnValues["friend"]] -= 1
  })

  const events4 = await contract.getPastEvents('Unfriend', {
    filter: { friend: account },
    fromBlock: 0,
    toBlock: 'latest'
  })

  events4.forEach(event => {
    friendCount[event.returnValues["executor"]] -= 1
  })

  for (const [address, value] of Object.entries(friendCount)) {
    const friendProfile = new web3.eth.Contract(UNIVERSALPROFILES, address)
    const profileCid = buffer.Buffer.from((await friendProfile.methods.getData('0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5').call()).replace('0x', ''), 'hex').toString().split('ipfs://')[1]
    const profileData = (await utilities.getIpfsData(profileCid)).LSP3Profile

    if (value === 1) {
      document.getElementById('friendList').innerHTML += `
        <div id="${address}" class="notification is-dark is-clickable">
          ${profileData.profileImage.length > 0 ? '<img src="https://cloudflare-ipfs.com/ipfs/' + profileData.profileImage[0].url.replace('ipfs://', '') + '">' : ""}
          <p class="title">${profileData.name ?? "Anonymous"}</p>
          <p class="subtitle">${address}</p>
        </div>
      `

      document.getElementById(address).onclick = () => {
        openChat(address)
      }
    } else if (value === 0) {
      document.getElementById('closedFriendList').innerHTML += `
        <div id="${address}" class="notification is-dark is-clickable">
          ${profileData.profileImage.length > 0 ? '<img src="https://cloudflare-ipfs.com/ipfs/' + profileData.profileImage[0].url.replace('ipfs://', '') + '">' : ""}
          <p class="title">${profileData.name ?? "Anonymous"}</p>
          <p class="subtitle">${address}</p>
        </div>
      `

      document.getElementById(address).onclick = () => {
        openChat(address)
      }
    }
  }

  document.getElementById('refreshActiveChats').onclick = document.getElementById('refreshClosedChats').onclick = async () => {
    document.getElementById("loader").classList = "pageloader is-black is-active"

    document.getElementById('friendList').innerHTML = ''
    document.getElementById('closedFriendList').innerHTML = ''

    await initFriends()

    document.getElementById("loader").classList = "pageloader is-black"
  }
}

const openChat = async (address) => {
  document.getElementById("loader").classList = "pageloader is-black is-active"

  document.getElementById('openActiveChats').classList = ""
  document.getElementById('openClosedChats').classList = ""
  document.getElementById('activeChats').style.display = "none"
  document.getElementById('closedChats').style.display = "none"
  document.getElementById('chatBox').style.display = ""

  document.getElementById('chatTitle').innerHTML = `Chat w ${address}`

  let messages = []

  const events1 = await contract.getPastEvents('Message', {
    filter: { sender: account, recipient: address },
    fromBlock: 0,
    toBlock: 'latest'
  })
 
  events1.forEach(event => {
    messages.push({
      side: false,
      message: event.returnValues.message,
      index: +event.blockNumber
    })
  })

  const events2 = await contract.getPastEvents('Message', {
    filter: { sender:address, recipient: account },
    fromBlock: 0,
    toBlock: 'latest'
  })
  
  events2.forEach(event => {
    messages.push({
      side: true,
      message: event.returnValues.message,
      index: +event.blockNumber
    })
  })

  messages.sort(function (a, b) {
    return a.index - b.index
  })

  messages.forEach((message) => {
    document.getElementById('messages').innerHTML += `
      <span class="tag is-success is-large" style="float: ${message.side ? "left" : "right" };">
        ${message.message}
      </span>
      <br><br>
    `
  })

  document.getElementById('sendMessage').onclick = async () => {
    if (document.getElementById('sendMessage').disabled) return

    document.getElementById('message').disabled = true
    document.getElementById('sendMessage').disabled = true

    await contract.methods.sendMessage(address, document.getElementById('message').value).send({
      from: account
    }).catch(err => {
      bulmaToast.toast({
        message: "Something wrong happened, please check console!",
        type: `is-danger`,
        dismissible: false,
        position: "bottom-center",
        animate: { in: 'fadeIn', out: 'fadeOut' },
      })
      
      document.getElementById('message').disabled = false
      document.getElementById('sendMessage').disabled = false

      return console.log(err)
    })

    document.getElementById('messages').innerHTML += `
      <span class="tag is-success is-large" style="float: right;">
        ${document.getElementById('message').value}
      </span>
      <br><br>
    `

    document.getElementById('message').disabled = false
    document.getElementById('sendMessage').disabled = false
    document.getElementById('message').value = ""
    
    bulmaToast.toast({
      message: "Message sent successfully!",
      type: `is-success`,
      dismissible: false,
      position: "bottom-center",
      animate: { in: 'fadeIn', out: 'fadeOut' },
    })
  }

  document.getElementById('closeChat').onclick = async () => {
    await contract.methods.unFriend(address).send({
      from: account
    }).catch(err => {
      bulmaToast.toast({
        message: "Something wrong happened, please check console!",
        type: `is-danger`,
        dismissible: false,
        position: "bottom-center",
        animate: { in: 'fadeIn', out: 'fadeOut' },
      })
      

      return console.log(err)
    })
    
    document.getElementById('openActiveChats').click()
    document.getElementById('refreshActiveChats').click()

    bulmaToast.toast({
      message: "Unfriended successfully!",
      type: `is-success`,
      dismissible: false,
      position: "bottom-center",
      animate: { in: 'fadeIn', out: 'fadeOut' },
    })
  }

  document.getElementById('refreshChat').onclick = () => {
    document.getElementById('messages').innerHTML = ""
    openChat(address)
  }

  document.getElementById("loader").classList = "pageloader is-black"
}

const utilities = {
  getIpfsData: async (cid) => {
    return await (await fetch(`https://cloudflare-ipfs.com/ipfs/${cid}`)).json()
  }
}

document.addEventListener("DOMContentLoaded", function () {
  main()
})
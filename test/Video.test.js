const Video = artifacts.require("Video");

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Video', (accounts) =>
{
    let video

    before( async () => {
        video = await Video.deployed()

    })

    describe('deployment', async () => {


        
    it('deploys success', async () => {
        video = await Video.deployed()
        const address = video.address
        console.log(address)
        assert.notEqual(address, 0x0)
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
        assert.notEqual(address, '')
    })

    })


    describe('storage', async () => {

        it('updates the video Hash', async () => {

            let videoHash
            videoHash = 'abc123'
            await video.set(videoHash)
            const result = await video.get()
            assert.equal(result, videoHash)


        })

    })
    

}
)


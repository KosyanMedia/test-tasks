// Aviasales homework
//
// The goal is to develop a system using existing APIs that
// minimizes the cost of processing messages from a queue
//
// We are given a Queue that emits messages with a mps (messages per second) rate.
// One of the requirements for the system is that the length of the queue should not
// go above some threshold.
//
// Each message that is produced by the Queue represents a workload. The size of the
// workload is some random value in a given range.
//
// We are given a Cluster that allows us to launch new instances of workers that are
// capable of processing jobs (you can think of this as some cloud API like AWS or GCE).
//
// Each instance takes some time to spin up and is billed per hour.
//
// This code implements a naive approach that launches a new instance for every
// job from the queue, processes this job and terminates the instance.
// Of course this way we do not utilize our cluster properly and pay way more than we could.
// Feel free to improve this solution and make it more cost efficient.

package main

import (
	"log"
	"math"
	"math/rand"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

// Job represents a message that we retrieve from a Queue
// and which should be processed by our system.
type Job struct {
	// The size of the Job determines how much time will the processing take.
	Size time.Duration
}

// Queue is a source of our Job messages
// it emits messages through the Messages channel.
type Queue struct {
	Length   int
	Messages chan Job
	mps      float64
	sync.Mutex
}

// NewQueue creates a Queue with a given mps rate.
func NewQueue(mps float64) *Queue {
	q := &Queue{Messages: make(chan Job)}
	interval := float64(time.Second) / mps
	go func() {
		for range time.NewTicker(time.Duration(interval)).C {
			q.Lock()
			q.Length++
			q.Unlock()
			go func() {
				q.Messages <- Job{Size: time.Duration(rand.Int31n(15)+1) * time.Second}
				q.Lock()
				q.Length--
				q.Unlock()
			}()
		}
	}()
	return q
}

// Instance represents a worker node.
type Instance struct {
	price float64
	start time.Time
}

// NewInstance creates an Instance with a given price.
func NewInstance(price float64) *Instance {
	return &Instance{price: price, start: time.Now()}
}

// ProcessJob receives a job and imitates processing through a time.Sleep call with a job size.
func (i *Instance) ProcessJob(j Job) {
	time.Sleep(j.Size)
}

// GetBill returns the current totalBill of an instance based on the time that it is running and the instance price.
func (i *Instance) GetBill() float64 {
	return math.Floor(time.Since(i.start).Minutes()+1) * i.price
}

// Cluster manages our instance nodes and provides the API to launch and terminate instances
type Cluster struct {
	instances map[*Instance]struct{}
	price     float64
	totalBill float64
	sync.RWMutex
}

// NewCluster creates a cluster with a given price per instance.
func NewCluster(price float64) *Cluster {
	return &Cluster{instances: make(map[*Instance]struct{}), price: price}
}

// LaunchInstance creates and returns a new Instance.
// It imitates instance spin up with a time.Sleep call.
func (c *Cluster) LaunchInstance() *Instance {
	i := NewInstance(c.price)
	c.Lock()
	c.instances[i] = struct{}{}
	c.Unlock()
	time.Sleep(time.Second * 3)
	return i
}

// TerminateInstance removes an instance from the cluster and
// adds the final instance bill to the total bill of the cluster.
func (c *Cluster) TerminateInstance(i *Instance) {
	c.Lock()
	defer c.Unlock()
	instanceBill := i.GetBill()
	delete(c.instances, i)
	c.totalBill += instanceBill
}

// GetSize returns the current number of nodes in the cluster.
func (c *Cluster) GetSize() int {
	c.RLock()
	defer c.RUnlock()
	return len(c.instances)
}

// GetBill calculates the sum of bills for running instances
// adds the total bill from the terminated instances and returns this value.
func (c *Cluster) GetBill() float64 {
	running := float64(0)
	c.RLock()
	defer c.RUnlock()
	for i := range c.instances {
		running += i.GetBill()
	}
	return c.totalBill + running
}

// process dispatches jobs from the queue to the cluster workers.
func process(q *Queue, c *Cluster) {
	for j := range q.Messages {
		go func(j Job) {
			i := c.LaunchInstance()
			i.ProcessJob(j)
			c.TerminateInstance(i)
		}(j)
	}
}

// watch logs the current queue length, cluster size and current bill once per second.
func watch(q *Queue, c *Cluster) {
	for range time.NewTicker(time.Second).C {
		log.Printf("queue length: %d, cluster size: %d, current bill: $%.2f\n", q.Length, c.GetSize(), c.GetBill())
	}
}

// wait waits for os signals and returns when gets one.
func wait(signals []os.Signal) os.Signal {
	quit := make(chan os.Signal, len(signals))
	signal.Notify(quit, signals...)
	return <-quit
}

func main() {
	log.Printf("running process with pid: %d\n", os.Getpid())
	start := time.Now()
	q := NewQueue(10)
	c := NewCluster(1)
	go process(q, c)
	go watch(q, c)
	log.Printf("received %s, exiting\n", wait([]os.Signal{syscall.SIGINT}))
	log.Printf("running time: %s, total bill: $%.2f\n", time.Since(start), c.GetBill())
}

package com.cloudkarting;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;

import java.util.List;
import java.util.Date;

import javax.inject.Named;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.ObjectifyService;

/**
 * Defines v1 of a driver API.
 */
@Api(
    name = "driver",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {
            Constants.WEB_CLIENT_ID,
            Constants.ANDROID_CLIENT_ID,
            Constants.IOS_CLIENT_ID,
            Constants.API_EXPLORER_CLIENT_ID
    },
    audiences = {Constants.ANDROID_AUDIENCE}
)
@Entity
public class Driver {
    @Id public Long id;
    @Index public String name, surname;
    @Index public Date creationDate;
    public Date updateDate;

    public Driver() {
        creationDate = new Date();
        updateDate = creationDate;
    }

    public Driver(String name, String surname) {
        this();
        this.name = name;
        this.surname = surname;
    }

//    public String getName() {
//        return name;
//    }
//
//    public void setUpdateDate(Date updateDate) {
//        this.updateDate = updateDate;
//    }

    public Driver createDriver(@Named("name") String name, @Named("surname") String surname) {

        Key<Driver> key = ObjectifyService.ofy().save().entity(new Driver(name, surname)).now();

        //System.out.println(key.getId());
        return getDriverById(key.getId());
    }


    public Driver getDriver(@Named("name") String name) {
        return ObjectifyService.ofy().load().type(Driver.class).filter("name", name).first().now();
    }

    @ApiMethod(name="getDriverById", path="getDriverById")
    public Driver getDriverById(@Named("id") Long id) {
        //System.out.println(ObjectifyService.ofy().load().type(Driver.class).id(id).now());
        return ObjectifyService.ofy().load().type(Driver.class).id(id).now();
    }

    public Driver updateDriver(@Named("id") Long id, @Named("name") String name,
                               @Named("surname") String surname) {

        Driver d = getDriverById(id);
        d.name = name;
        d.surname = surname;
        d.updateDate = new Date();

        Key<Driver> key = ObjectifyService.ofy().save().entity(d).now();
        return getDriverById(key.getId());
    }

    public Driver deleteDriver(@Named("name") String name) {
        Driver p = getDriver(name);

        ObjectifyService.ofy().delete().entity(p).now();
        return p;
    }

    public List<Driver> listDrivers() {
        return ObjectifyService.ofy()
                .load()
                .type(Driver.class)
                        //.ancestor(Objects)
                        // .order("-creationDate")
                        // .limit(5)
                .list();
    }
}
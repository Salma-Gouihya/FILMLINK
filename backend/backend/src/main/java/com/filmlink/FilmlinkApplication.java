package com.filmlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class FilmlinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(FilmlinkApplication.class, args);
    }
}
